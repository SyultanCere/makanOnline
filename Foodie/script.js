const products=[
 {name:"Margherita Pizza",cat:"Pizza",price:65000,img:"assets/margherita.jpg",desc:"Pizza klasik dengan saus tomat segar, mozzarella, dan basil."},
 {name:"Pepperoni Pizza",cat:"Pizza",price:75000,img:"assets/pepperoni.jpg",desc:"Pizza dengan topping pepperoni dan keju."},
 {name:"Cheese Lovers Pizza",cat:"Pizza",price:78000,img:"assets/cheese.jpg",desc:"Untuk pecinta keju: mozzarella, cheddar, dan parmesan."},
 {name:"Hawaiian Pizza",cat:"Pizza",price:70000,img:"assets/hawaiian.jpg",desc:"Pizza dengan ham dan nanas."},
 {name:"Cheese Burger",cat:"Burger",price:28000,img:"assets/burger.jpg",desc:"Burger juicy dengan keju dan sayuran segar."},
 {name:"Spicy Ramen",cat:"Pasta",price:32000,img:"assets/ramen.jpg",desc:"Ramen kuah pedas dengan topping lengkap."}
];
let cart=[];
let currentProduct=products[0], detailQty=1, selectedPrice=65000;

const money=n=>"Rp "+n.toLocaleString("id-ID");
function showPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));
 document.getElementById(id).classList.add("active-page");
 document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
 if(id==="search") renderProducts();
 if(id==="cart") renderCart();
 if(id==="checkout") renderCheckout();
 window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));

function renderProducts(cat="Semua",term=""){
 const list=document.getElementById("productList");
 const filtered=products.filter(p=>(cat==="Semua"||p.cat===cat)&&p.name.toLowerCase().includes(term.toLowerCase()));
 list.innerHTML=filtered.length?filtered.map(p=>`<article class="product-card" onclick="openProduct('${p.name}')"><img src="${p.img}"><div><h3>${p.name}</h3><p>${p.desc}</p></div><div class="price">${money(p.price)}</div></article>`).join(""):`<div class="empty">Makanan tidak ditemukan.</div>`;
}
document.getElementById("searchInput").addEventListener("input",e=>renderProducts(document.querySelector(".chip.active").dataset.cat,e.target.value));
document.querySelectorAll(".chip").forEach(c=>c.addEventListener("click",()=>{
 document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));c.classList.add("active");renderProducts(c.dataset.cat,document.getElementById("searchInput").value);
}));
document.getElementById("homeSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){document.getElementById("searchInput").value=e.target.value;showPage("search");}});
function filterCategory(cat){showPage("search");document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x.dataset.cat===cat));renderProducts(cat);}
function openProduct(name){
 currentProduct=products.find(p=>p.name===name)||products[0];detailQty=1;selectedPrice=currentProduct.price;
 document.getElementById("detailImage").src=currentProduct.img;
 document.getElementById("detailName").textContent=currentProduct.name;
 document.getElementById("detailPrice").textContent=money(currentProduct.price);
 document.getElementById("detailQty").textContent=1;
 document.querySelectorAll(".toppings input").forEach(x=>x.checked=false);
 document.querySelectorAll(".size-options button").forEach(x=>x.classList.remove("selected"));
 document.querySelector('.size-options button[data-price="65000"]').classList.add("selected");
 showPage("product");
}
document.querySelectorAll(".size-options button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".size-options button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selectedPrice=Number(b.dataset.price);document.getElementById("detailPrice").textContent=money(selectedPrice)}));
function changeDetailQty(d){detailQty=Math.max(1,detailQty+d);document.getElementById("detailQty").textContent=detailQty}
function addDetailToCart(){
 let extra=[...document.querySelectorAll(".toppings input:checked")].reduce((s,x)=>s+Number(x.dataset.extra),0);
 let item={name:currentProduct.name,price:selectedPrice+extra,qty:detailQty,img:currentProduct.img};
 let found=cart.find(x=>x.name===item.name&&x.price===item.price);found?found.qty+=item.qty:cart.push(item);
 updateBadge();showPage("cart");
}
function updateBadge(){document.getElementById("cartBadge").textContent=cart.reduce((s,x)=>s+x.qty,0)}
function renderCart(){
 const box=document.getElementById("cartItems");
 if(!cart.length){box.innerHTML='<div class="empty">Keranjang masih kosong 🛒</div>';document.getElementById("subtotal").textContent=money(0);document.getElementById("total").textContent=money(10000);return}
 box.innerHTML=cart.map((x,i)=>`<div class="cart-row"><img src="${x.img}"><div class="grow"><h3>${x.name}</h3><p>${money(x.price)}</p><div class="mini-qty"><button onclick="changeCart(${i},-1)">−</button><span>${x.qty}</span><button onclick="changeCart(${i},1)">+</button></div></div><button class="trash" onclick="removeCart(${i})">♨</button></div>`).join("");
 let sub=cart.reduce((s,x)=>s+x.price*x.qty,0);document.getElementById("subtotal").textContent=money(sub);document.getElementById("total").textContent=money(sub+10000);
}
function changeCart(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);updateBadge();renderCart()}
function removeCart(i){cart.splice(i,1);updateBadge();renderCart()}
function renderCheckout(){let sub=cart.reduce((s,x)=>s+x.price*x.qty,0),count=cart.reduce((s,x)=>s+x.qty,0);document.getElementById("checkoutCount").textContent=count+" item";document.getElementById("checkoutSubtotal").textContent=money(sub);document.getElementById("checkoutTotal").textContent=money(sub+10000)}
function placeOrder(){if(!cart.length){alert("Keranjang masih kosong.");return}cart=[];updateBadge();showPage("success")}
renderProducts();updateBadge();
