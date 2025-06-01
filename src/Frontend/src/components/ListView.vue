<template>
  <notification-view
    v-if="isNotificationVisible"
    v-model:visible="isNotificationVisible"
    :image="notificationData.icon"
    :notificationContent="notificationData.message"
    :buttonText="notificationData.buttonContent"
    @confirm="handleNotificationClick"
  >
  </notification-view>

  <overlay-form-view
    v-if="isFormVisible"
    v-model:visible="isFormVisible"
    :item-data="selectedItem"
    :op-type="operationType"
    :categories="categories"
    @submit="handleFormSubmit"
  ></overlay-form-view>

  <div v-if="list" class="list-container">
    <div class="control_tab">
      <button class="add-btn btn" @click="showAddForm">Add</button>
      <button class="export-btn btn">export</button>
      <div class="search_container">
        <div v-html="searchIcon"></div>
        <input class="search-input" type="text" placeholder="Search a transaction..." />
      </div>
    </div>
    <div class="list_titles">
      <h3>#</h3>
      <h3>Description</h3>
      <h3>Category</h3>
      <div class="combination">
        <div class="sort-arrow">&uarr;</div>
        <h3>Amount</h3>
      </div>
      <div class="combination">
        <div class="sort-arrow">&uarr;</div>
        <h3>Date Added</h3>
      </div>
      <div class="combination">
        <div class="sort-arrow">&uarr;</div>
        <h3>Date Updated</h3>
      </div>
    </div>
    <transition-group name="fade" tag="ul" class="list">
      <li
        v-for="(item, index) in list"
        :key="item.id"
        @mouseenter="setIsHovered(index)"
        @mouseleave="setIsHovered(index)"
      >
        <div class="id">{{ index + 1 }}</div>
        <div class="description">{{ item.description }}</div>
        <div class="category">
          <div class="category-img" v-html="item.categoryImage"></div>
          <p>{{ item.categoryName }}</p>
        </div>
        <div class="amount">{{ item.amount }}</div>
        <div class="d_add">{{ item.transactionDate }}</div>
        <div class="d_upload">{{ item.updatedAt }}</div>
        <div v-if="isHovered[index]" class="controls">
          <div class="modify button">
            <div v-html="editSvg" @click="updateItem(index)"></div>
          </div>
          <div class="delete button" @click="notifyUser(item.id, 3)">
            <div v-html="deleteSvg"></div>
          </div>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import OverlayFormView from "./OverlayFormView.vue";
import NotificationView from "./NotificationView.vue";
import { mapGetters } from "vuex";
export default {
  components: { OverlayFormView, NotificationView },
  props: ["list", "categories"],
  data() {
    return {
      operationType: -1,
      notificationData: {
        itemId: -1,
        icon: "",
        message: "",
        buttonContent: "",
      },
      notificationIcons: [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#63E6BE" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#f57a7a" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
      ],
      isNotificationVisible: false,
      isFormVisible: false,
      selectedItem: {},
      editSvg: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 15L4 16V20H8L14 14M18 10L21 7L17 3L14 6M18 10L17 11M18 10L14 6M14 6L7.5 12.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
      deleteSvg: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12V17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 12V17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 7H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
      isHovered: Array(this.list.length).fill(false),
      searchIcon:
        '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 26 26" width="20px" height="20px"><path d="M 10 0.1875 C 4.578125 0.1875 0.1875 4.578125 0.1875 10 C 0.1875 15.421875 4.578125 19.8125 10 19.8125 C 12.289063 19.8125 14.394531 19.003906 16.0625 17.6875 L 16.9375 18.5625 C 16.570313 19.253906 16.699219 20.136719 17.28125 20.71875 L 21.875 25.34375 C 22.589844 26.058594 23.753906 26.058594 24.46875 25.34375 L 25.34375 24.46875 C 26.058594 23.753906 26.058594 22.589844 25.34375 21.875 L 20.71875 17.28125 C 20.132813 16.695313 19.253906 16.59375 18.5625 16.96875 L 17.6875 16.09375 C 19.011719 14.421875 19.8125 12.300781 19.8125 10 C 19.8125 4.578125 15.421875 0.1875 10 0.1875 Z M 10 2 C 14.417969 2 18 5.582031 18 10 C 18 14.417969 14.417969 18 10 18 C 5.582031 18 2 14.417969 2 10 C 2 5.582031 5.582031 2 10 2 Z M 4.9375 7.46875 C 4.421875 8.304688 4.125 9.289063 4.125 10.34375 C 4.125 13.371094 6.566406 15.8125 9.59375 15.8125 C 10.761719 15.8125 11.859375 15.433594 12.75 14.8125 C 12.511719 14.839844 12.246094 14.84375 12 14.84375 C 8.085938 14.84375 4.9375 11.695313 4.9375 7.78125 C 4.9375 7.675781 4.933594 7.574219 4.9375 7.46875 Z"/></svg>',
    };
  },
  methods: {
    setIsHovered(index) {
      this.isHovered.fill(false);
      this.isHovered[index] = true;
    },
    formatDate(date) {
      return date.toISOString().split("T")[0];
    },
    showAddForm() {
      this.isFormVisible = true;
      this.operationType = 1;
      this.selectedItem = {
        date: this.formatDate(new Date()),
      };
    },
    updateItem(index) {
      this.isFormVisible = true;
      this.operationType = 2;
      this.selectedItem = {
        itemId: this.list[index].id,
        description: this.list[index].description,
        amount: this.list[index].amount,
        category: this.list[index].categoryName,
      };
    },
    notifyUser(
      index = -1,
      operationType = -1,
      message = "Delete This Operation ?",
      buttonContent = "Delete",
      icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#f57a7a" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>'
    ) {
      this.operationType = operationType;
      this.notificationData.itemId = index;
      this.notificationData.buttonContent = buttonContent;
      this.notificationData.message = message;
      this.notificationData.icon = icon;
      this.isNotificationVisible = true;
    },
    handleNotificationClick() {
      if (this.operationType == 3) {
        let data = {
          itemId: this.notificationData.itemId,
        };
        this.$store.dispatch("deleteExpense", data);
      } else {
        this.isNotificationVisible = false;
      }
    },
    handleFormSubmit(data) {
      console.log(data);
      console.log(data.amount);
      if (data.amount != undefined) {
        console.log(`here because ${data.amount}`);
        if (this.operationType == 1) {
          this.$store.dispatch("addExpense", data);
        } else if (this.operationType == 2) {
          this.$store.dispatch("updateExpense", data);
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      "getIsLoading",
      "getAddExpenseStatus",
      "getUpdateExpenseStatus",
      "getDeleteExpenseStatus",
    ]),
  },
  watch: {
    getAddExpenseStatus(newVal) {
      if (newVal == true) {
        this.notifyUser(
          -1,
          -1,
          "Operation Performed Successfully !",
          "OK",
          this.notificationIcons[0]
        );
      } else {
        this.notifyUser(-1, -1, "something went wrong !", "OK", this.notificationIcons[1]);
      }
    },
    getUpdateExpenseStatus(newVal) {
      if (newVal == true) {
        this.notifyUser(
          -1,
          -1,
          "Operation Performed Successfully !",
          "OK",
          this.notificationIcons[0]
        );
      }
      this.notifyUser(-1, -1, "something went wrong !", "OK", this.notificationIcons[1]);
    },
    getDeleteExpenseStatus(newVal) {
      if (newVal == true) this.isNotificationVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/_base.scss";

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
/* Leaving */
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

li {
  list-style: none;
}

.list-container {
  background-color: #f4f7fa;
  width: 100%;
  height: 50rem;
  @include flex(column, flex-start, center, 0.2rem);

  .control_tab {
    width: 100%;
    height: 6rem;
    padding: 0.2rem 2rem;
    @include flex(row, flex-start, center, 2rem);
    gap: 1rem;

    .btn {
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #1a6d89;
      }
    }

    .add-btn {
      background-color: #1ba7de;
    }

    .export-btn {
      background-color: #15a832;
    }

    .search_container {
      @include flex(row, flex-start, center, 1rem);
      width: 30%;
      height: 80%;
      background-color: #e0ecf1;
      padding-left: 1rem;
      border-radius: 15px;
      box-shadow: 0px 0px 5px -3px black;
      .search-input {
        padding: 0.8rem;
        font-size: 1rem;
        background-color: transparent;
        border: transparent;
        width: 100%;
        height: 100%;
        font-size: 1.2rem;

        &:focus {
          border: transparent;
          outline: transparent;
        }
      }
    }
  }

  .list_titles {
    width: 99.5%;
    height: 5rem;
    padding: 1rem;
    margin-right: 1rem;
    background-color: #b4bdc1;
    color: black;
    font-weight: bold;
    border-radius: 8px;
    display: grid;
    grid-template-columns: 0.3fr 2fr 1fr 1fr 1fr 1fr;
    align-items: center;
    text-align: center;

    h3 {
      margin: 0;
    }

    .combination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      .sort-arrow {
        cursor: pointer;
        transition: transform 0.3s;
      }

      .sort-arrow:hover {
        transform: rotate(180deg);
      }
    }
  }

  ul {
    width: 100%;
    height: 100%;
    padding: 0;
    padding: 0.2rem 0 0.2rem 0.2rem;
    overflow-y: auto;
    overflow-x: hidden;
    @include flex(column, flex-start, center, 0.5rem);

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background-color: #f0f0f0;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #000000;
      border-radius: 10px;
      border: 2px solid #ffffff;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #1a6d89;
    }
    li {
      position: relative;
      width: 99.5%;
      min-height: 5rem;
      margin-right: 1rem;
      border-bottom: 1px solid #e0e0e0;
      display: grid;
      grid-template-columns: 0.3fr 2fr 1fr 1fr 1fr 1fr;
      align-items: center;
      box-shadow: 0px 0px 4px -1px black;
      border-radius: 0.5rem;
      padding: 0.8rem;
      gap: 1rem;
      transition: background-color 0.3s;

      &:hover {
        background-color: #e8e8e8;
      }

      .id,
      .description,
      .amount,
      .d_add,
      .d_upload {
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
      }

      .category {
        @include flex(row, center, center, 1rem);
        height: 100%;
        .category-img {
          width: 2rem;
          height: 2rem;
        }

        p {
          font-size: 1.2rem;
        }
      }

      .amount {
        font-weight: bold;
        color: #27ae60;
      }

      .d_add,
      .d_upload {
        color: #7f8c8d;
      }

      .controls {
        position: absolute;
        width: 10rem;
        height: 100%;
        right: 0;
        padding-right: 1rem;
        @include flex(row, flex-end, center, 0.5rem);

        .button {
          width: 3rem;
          height: 3rem;
          border: none;
          border-radius: 0.3rem;
          @include flex(row, center, center, 0);

          &:hover {
            cursor: pointer;
          }
        }
        .modify {
          background-color: #52ba60;
        }

        .delete {
          background-color: #f54d41;
        }
      }
    }
  }
}
</style>
