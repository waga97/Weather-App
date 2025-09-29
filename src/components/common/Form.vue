<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { ZodType, infer as ZodInfer, ZodError } from 'zod'
import TextField from './TextField.vue'

export interface FieldConfig {
  name: string
  label: string
  type?: string
}

type FormDataShape = Record<string, string>

const props = defineProps<{
  fields: FieldConfig[]
  schema: ZodType<FormDataShape>
  initialValues?: ZodInfer<ZodType<FormDataShape>>
}>()

const emit = defineEmits<{
  (e: 'submit', values: ZodInfer<ZodType<FormDataShape>>): void
}>()

type FormValues = ZodInfer<ZodType<FormDataShape>>

const initialData =
  props.initialValues ??
  props.fields.reduce((acc: FormValues, f: FieldConfig) => {
    acc[f.name as keyof FormValues] = '' as string
    return acc
  }, {} as FormValues)

const formData = reactive<FormValues>(initialData)

const errors = reactive<Record<string, string>>({})

function useVModelForField(name: string) {
  return computed({
    get() {
      const value = formData[name as keyof FormValues]
      return (value ?? '') as string
    },
    set(value: string) {
      formData[name as keyof FormValues] = value as FormValues[keyof FormValues]
    },
  })
}

function validate() {
  for (const key in errors) errors[key] = ''

  const result = props.schema.safeParse(formData)

  if (!result.success) {
    type ZodIssueType = ZodError['issues'][number]

    result.error.issues.forEach((issue: ZodIssueType) => {
      const field = issue.path[0] as string
      errors[field] = issue.message
    })
    return false
  }
  return true
}

function handleSubmit() {
  if (validate()) {
    emit('submit', { ...formData })
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <TextField
      v-for="field in fields"
      :key="field.name"
      v-model="useVModelForField(field.name).value"
      :label="field.label"
      :name="field.name"
      :type="field.type"
      :error="errors[field.name]"
    />
    <slot></slot>
  </form>
</template>
