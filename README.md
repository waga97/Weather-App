# Weather App  

This is a single-page application built with **Vue 3** and **Vuex**, focusing on robust client-side state management and data persistence using `localStorage` and `sessionStorage`.

---

## Getting Started

To run this project locally:

### 1. Install dependencies
```bash
pnpm i
```

### 2. Run the development server
```bash
pnpm dev
```

---

## Application Architecture

This application strictly separates concerns, ensuring that complex data handling is isolated in dedicated **service layers**.

---

### 1. Data Persistence Strategy

Data persistence is crucial for a smooth user experience.  
We utilize the browser’s **Web Storage APIs**:

| **Data Type**     | **Storage Mechanism** | **Purpose** |
|--------------------|-----------------------|-------------|
| User Profile       | `localStorage`        | Persists user name, email, and phone across browser sessions and refreshes. |
| Saved Capitals     | `localStorage`        | Persists user-added capital cities across browser sessions. |
| User Location      | `sessionStorage`      | Stores the user’s detected location (city/country) only for the current browsing session to ensure freshness. |

---

### 2. State Hydration 

The key to preventing data loss on refresh is **synchronous state hydration** in Vuex:

- **Service Layer Responsibility**  
  `userService` and `capitalService` modules contain synchronous methods (`getInitialProfile()` and `getInitialCapitals()`) that immediately load persisted data from `localStorage` on file execution.

- **Vuex Responsibility**  
  The `state()` function in `store/modules/user.ts` calls these synchronous methods, ensuring state is never initialized as empty if previous data exists.  

---

### 3. Profile Flow (`store/modules/user.ts`)

| **Action/State** | **Description** | **Persistence Handled By** |
|-------------------|-----------------|-----------------------------|
| `state()` | Profile is immediately loaded from `localStorage` via `userService.getInitialProfile()`. | `userService.ts` |
| `updateProfile` | Dispatches the action with new form data. Calls `userService.updateProfile()`. | `userService.ts` (saves to `localStorage` after update) |
| `fetchProfile` | Remains available for async loading or error handling (not strictly needed for persistence). | N/A |

---

### 4. Capital Flow (`store/modules/user.ts`)

Capitals data handling is standardized, with complex logic delegated to the **service layer**:

| **Action/State** | **Description** | **Core Logic Handled By** |
|-------------------|-----------------|----------------------------|
| `state()` | Capitals list is immediately loaded from `localStorage` via `capitalService.getInitialCapitals()`. | `capitalService.ts` |
| `fetchCapitals` | 1. Runs `detectAndSaveMyLocation()` (saves current city/country to `sessionStorage`). <br> 2. Calls `capitalService.getCapitals()`. | `capitalService.ts` (merges user location with saved capitals) |
| `SET_CAPITALS` | Simple state setter. Receives list already merged/saved by service. | N/A |

---

### 5. Manual Session Clear

- If `sessionStorage` is cleared manually,  
  ➝ `fetchCapitals` will **re-run `detectAndSaveMyLocation()`**, restoring the user’s current location on the next load.

---

## Summary

- **Profiles** persist across sessions with `localStorage`.  
- **Capitals** are merged with the user’s **current location**, saved to `sessionStorage`.  
- **Vuex state hydration** prevents flicker and ensures smooth reloads.  
- Clear separation of **Vuex (state management)** and **services (persistence logic)**.  

---


## Tech Stack

- [Vue 3](https://vuejs.org/)  
- [Vuex](https://vuex.vuejs.org/)  
- [PNPM](https://pnpm.io/)  
- [Weather API - Open Meteo](https://open-meteo.com/)  
 
