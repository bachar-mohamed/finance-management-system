<template>
  <div class="empty-state-container">
    <div class="empty-state-animation">
      <svg
        class="empty-box"
        width="200"
        height="200"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Box -->
        <rect
          class="box"
          x="40"
          y="60"
          width="120"
          height="100"
          rx="5"
          fill="#e9ecef"
          stroke="#6c757d"
          stroke-width="2"
        />
        <!-- Box lid -->
        <path
          class="box-lid"
          d="M30 60 L100 30 L170 60"
          fill="none"
          stroke="#6c757d"
          stroke-width="2"
        />
        <!-- Dotted line (data representation) -->
        <path
          class="dotted-line"
          d="M60 90 L140 90"
          stroke="#6c757d"
          stroke-width="2"
          stroke-dasharray="5,5"
        />
        <path
          class="dotted-line"
          d="M60 110 L140 110"
          stroke="#6c757d"
          stroke-width="2"
          stroke-dasharray="5,5"
        />
        <path
          class="dotted-line"
          d="M60 130 L140 130"
          stroke="#6c757d"
          stroke-width="2"
          stroke-dasharray="5,5"
        />
        <!-- Question mark -->
        <text
          class="question-mark"
          x="100"
          y="115"
          font-size="40"
          text-anchor="middle"
          fill="#6c757d"
        >
          ?
        </text>
      </svg>
    </div>

    <!-- Content section with title, message and button -->
    <div class="empty-state-content">
      <h2 class="empty-state-title">{{ title }}</h2>
      <p class="empty-state-message">{{ message }}</p>
      <button class="add-data-button" @click="handleAddData" :disabled="buttonDisabled">
        <span class="button-icon">+</span>
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmptyStateMessage",
  props: {
    /**
     * The title to display in the empty state
     */
    title: {
      type: String,
      default: "No Data Available",
    },
    /**
     * The message to display in the empty state
     */
    message: {
      type: String,
      default: "There is no data to display at the moment.",
    },
    /**
     * The text for the add data button
     */
    buttonText: {
      type: String,
      default: "Add New Data",
    },
    /**
     * Whether the add button should be disabled
     */
    buttonDisabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /**
     * Handle the add data button click
     * Emits an event to the parent component
     */
    handleAddData() {
      this.$emit("add-data");
    },
  },
};
</script>

<style scoped>
/* Main container */
.empty-state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  min-height: 400px;
  width: 100%;
}

/* Animation container */
.empty-state-animation {
  margin-bottom: 2rem;
}

/* Animation for the empty box */
.empty-box {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Animation for the question mark */
.question-mark {
  animation: pulse 2s ease-in-out infinite;
  transform-origin: center;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

/* Content section */
.empty-state-content {
  max-width: 500px;
}

/* Title styling */
.empty-state-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #343a40;
}

/* Message styling */
.empty-state-message {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 1.5rem;
}

/* Button styling */
.add-data-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-data-button:hover {
  background-color: #3a7bc8;
}

.add-data-button:disabled {
  background-color: #a0c1e4;
  cursor: not-allowed;
}

.button-icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

/* Responsive styles for tablet devices */
@media (max-width: 768px) {
  .empty-state-container {
    padding: 1.5rem;
  }

  .empty-box {
    width: 150px;
    height: 150px;
  }

  .empty-state-title {
    font-size: 1.25rem;
  }

  .empty-state-message {
    font-size: 0.9rem;
  }
}

/* Responsive styles for mobile devices */
@media (max-width: 480px) {
  .empty-state-container {
    padding: 1rem;
    min-height: 300px;
  }

  .empty-box {
    width: 120px;
    height: 120px;
  }

  .add-data-button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>
