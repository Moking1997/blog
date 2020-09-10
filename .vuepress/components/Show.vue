<template>
  <ul class="show">
    <li class="show-item" v-for="item in items" :key="item.name">
      <div class="show-item-front">
        <img class="show-item-img" src="/src/firework/firework.gif" alt />
      </div>
      <div class="show-item-back">
        <div class="show-item-back-title">Canvas</div>
        <div class="show-item-back-text">烟花</div>
        <a :href="item.url" class="show-item-back-url">查看</a>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      items: [{ name: "fireWork", url: "/src/firework/firework.html" }],
    };
  },
};
</script>

<style>
ul,
li {
  list-style: none;
}
.show {
  max-width: 1020px;
  margin: 0 auto;
  padding: 1vw 1vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.show-item {
  position: relative;
  margin-top: 30px;
  width: 24vw;
  height: 150px;
  max-width: 260px;
  box-shadow: rgba(0, 0, 0, 0.55) 0px 1px 4px;
  transform-style: preserve-3d;
  transition: 0.6s ease-in-out;
}
.show-item:hover {
  transform: rotateY(-180deg);
}
.show-item-front {
  position: absolute;
  backface-visibility: hidden;
}
.show-item-back {
  width: 100%;
  backface-visibility: hidden;
  position: absolute;
  transform: rotateY(180deg);
  text-align: center;
}
.show-item-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.show-item-back-title {
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: #3eaf7c;
}
.show-item-back-text {
  display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
  -webkit-line-clamp: 2; /* 控制最多显示几行 */
  -webkit-box-orient: vertical;
  height: 66px;
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  margin-bottom: 10px;
}
.show-item-back-url {
  margin-top: 10px;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
  display: block;
  width: 50px;
  margin: 0 auto;
  border-right: 5px;
  background: cornflowerblue;
  color: #fff;
}
</style>

