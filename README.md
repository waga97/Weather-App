Weather App
This is a single-page application built with Vue 3 and Vuex, focusing on robust client-side state management and data persistence using local and session storage.

Getting Started
To run this project locally, follow these simple steps:

Install dependencies:

pnpm i

Run the development server:

pnpm dev

Application Architecture
This application strictly separates concerns, ensuring that complex data handling is isolated in dedicated service layers.

1. Data Persistence Strategy
   Data persistence is crucial for a smooth user experience. We utilize the browser's Web Storage APIs:

Data Type

Storage Mechanism

Purpose

User Profile

localStorage

Persists user name, email, and phone across browser sessions and refreshes.

Saved Capitals

localStorage

Persists user-added capital cities across browser sessions.

User Location

sessionStorage

Stores the user's detected location (city/country) only for the current browsing session. This ensures the "My Location" marker is fresh.

2. State Hydration (The "Profile is Gone" Fix)
   The key to preventing data loss on refresh is synchronous state hydration in Vuex:

Service Layer Responsibility: The userService and capitalService modules now contain synchronous methods (getInitialProfile() and getInitialCapitals()) that immediately load persisted data from localStorage upon file execution.

Vuex Responsibility: The state() function in store/modules/user.ts calls these synchronous methods. This ensures the Vuex state is never initialized as empty (undefined or '') if previous data exists, eliminating the "blank screen flicker."

3. Profile Flow (store/modules/user.ts)
   Action/State

Description

Persistence Handled By

state()

Profile is immediately loaded from localStorage via userService.getInitialProfile().

userService.ts

updateProfile

Dispatches the action with new form data. Calls userService.updateProfile().

userService.ts (saves to localStorage after update)

fetchProfile

Remains available for initial asynchronous loading or error handling, but is not strictly necessary for persistence.

N/A

4. Capital Flow (store/modules/user.ts)
   Capitals data handling is standardized and complex logic is handled within the service:

Action/State

Description

Core Logic Handled By

state()

Capitals list is immediately loaded from localStorage via capitalService.getInitialCapitals().

capitalService.ts

fetchCapitals

1. await detectAndSaveMyLocation(): This critical step ensures the user's current city/country is saved to sessionStorage. 2. Calls capitalService.getCapitals().

capitalService.ts (handles merging user location with saved capitals)

SET_CAPITALS

The mutation is now a simple state setter. It receives the list already merged and saved by the service layer.

N/A

Manual Session Clear

If sessionStorage is manually cleared, fetchCapitals will automatically re-run detectAndSaveMyLocation(), restoring the current location on the next load.

fetchCapitals action
