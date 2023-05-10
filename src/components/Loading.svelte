<script>
    export let size = "64px"; // default size is 64px
  </script>
<style>
    .spinner {
      width: 40px;
      height: 40px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: move 5s ease-in-out infinite;
    }
  
    @keyframes move {
      0% { transform: translate(-50%, -50%); }
      25% { transform: translate(0%, -50%); }
      50% { transform: translate(0%, 50%); }
      75% { transform: translate(-50%, 50%); }
      100% { transform: translate(-50%, -50%); }
    }
  </style>
  
  
  
  <div class="spinner">
    <img src="/pika.webp" alt="Loading spinner" />
  </div>
  