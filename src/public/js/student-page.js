document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".nav-item");
  const tabContents = document.querySelectorAll(".tab-content");

  function switchTab(tabId) {
    // Ẩn tất cả content
    tabContents.forEach((content) => {
      content.classList.remove("active");
    });

    // Bỏ active khỏi tất cả nav items
    navItems.forEach((item) => {
      item.classList.remove("active");
    });

    // Hiện content được chọn
    const selectedContent = document.getElementById(tabId);
    const selectedNav = document.querySelector(`[data-tab="${tabId}"]`);

    if (selectedContent && selectedNav) {
      selectedContent.classList.add("active");
      selectedNav.classList.add("active");
    }
  }

  // Thêm event listeners cho các nav items
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const tabId = this.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  document
    .getElementById("upload-btn")
    .addEventListener("click", async function () {
      const fileInput = document.getElementById("avatar-input");
      const file = fileInput.files[0];

      if (!file) {
        alert("Please select an image first");
        return;
      }

      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await fetch("/student/upload-avatar", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          document.getElementById(
            "avatar-preview"
          ).src = `data:image/jpeg;base64,${data.avatar}`;
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Upload failed");
      }
    });
});

/* eslint-disable no-undef */
const buttonContainer = document.getElementById("button-container");
const contentContainer = document.getElementById("content-container");
let isOpen = false;
let config = {
  RETURN_URL: window.location.origin,
  ELEMENT_ID: "embeded-payment-container",
  CHECKOUT_URL: "",
  embedded: true,
  onSuccess: (event) => {
    contentContainer.innerHTML = `
        <div style="padding-top: 20px; padding-bottom:20px">
            Thanh toan thanh cong
        </div>
    `;
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: rgb(131, 217, 142);
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Quay lại trang thanh toán
        </button>
    `;
  },
};
buttonContainer.addEventListener("click", async (event) => {
  if (isOpen) {
    const { exit } = PayOSCheckout.usePayOS(config);
    exit();
  } else {
    const checkoutUrl = await getPaymentLink();
    config = {
      ...config,
      CHECKOUT_URL: checkoutUrl,
    };
    console.log(checkoutUrl);
    const { open } = PayOSCheckout.usePayOS(config);
    open();
  }
  isOpen = !isOpen;
  changeButton();
});

const getPaymentLink = async () => {
  const response = await fetch(
    "http://localhost:3000/student/create-embedded-payment-link",
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    console.log("server doesn't response!");
  }
  const result = await response.json();

  console.log(result);
  console.log(response);
  return result.checkoutUrl;
};

const changeButton = () => {
  if (isOpen) {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: gray;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Đóng link thanh toán
        </button>
      `;
  } else {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
                width: 100%;
                background-color: rgb(131, 217, 142);
                color: white;
                border: none;
                padding: 10px;
                font-size: 15px;
            "
            >
            Tạo Link thanh toán
        </button> 
    `;
  }
};
