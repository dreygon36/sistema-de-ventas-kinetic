function toggleMenu(){
  let menu = document.getElementById("menu");

  if(menu.style.display === "flex"){
    menu.style.display = "none";
  }else{
    menu.style.display = "flex";
  }
}