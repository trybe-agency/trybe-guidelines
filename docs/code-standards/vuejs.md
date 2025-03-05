# Vue.js Code Guidelines

## Separation of Long Conditions

### Why?
- Improves readability and maintainability.
- Makes debugging easier by giving meaningful names to conditions.
- Reduces complexity in templates and methods.

---

### How to Apply
#### CSS Conditions
Move complex `class` binding logic into computed properties or methods.

#### JS Conditions
Assign long conditions to well-named variables.

---

### Examples

#### **CSS Condition Example**

**Before:**
```vue
<template>
  <div :class="{ 'active-item': isEnabled && userRole === 'admin' && currentStep > 2 }">
    Content
  </div>
</template>
```
**after:**
```vue
<script>
export default {
  computed: {
    isActiveItem() {
      return this.isEnabled && this.userRole === 'admin' && this.currentStep > 2;
    },
  },
};
</script>

<template>
  <div :class="{ 'active-item': isActiveItem }">
    Content
  </div>
</template>
```

#### **JS Condition Example**

**Before:**
```vue
<script>
export default {
  methods: {
    handleAction() {
      if (this.isEnabled && this.userRole === 'admin' && this.currentStep > 2) {
        this.performAction();
      }
    },
  },
};
</script>

```
**after:**
```vue
<script>
export default {
  methods: {
    handleAction() {
      const canPerformAction =
        this.isEnabled && this.userRole === 'admin' && this.currentStep > 2;
      if (canPerformAction) {
        this.performAction();
      }
    },
  },
};
</script>
```

### Naming Guidelines for Variables

- Use descriptive names that indicate the purpose of the condition (e.g., `isActiveItem`, `canPerformAction`).
- Avoid generic terms like `flag`, `temp`, or `condition`.
