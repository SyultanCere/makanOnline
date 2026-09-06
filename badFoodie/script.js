const products=[
 {name:"PIZZA 1",price:65000,img:"assets/pizza.jpg",desc:"Pizza super enak banget"},
 {name:"PIZZA 2",price:75000,img:"assets/pizza2.jpg",desc:"Pizza keju spesial"},
 {name:"PIZZA 3",price:78000,img:"assets/pizza3.jpg",desc:"Pizza topping lengkap"}
];
let cart=[
 {name:"Pizza Super",price:65000,qty:1},
 {name:"Ramen Spicy",price:30000,qty:1},
 {name:"Lemon Tea",price:15000,qty:1}
];
let current=products[0],qty=1,basePrice=65000;

const money=n=>n.toLocaleString("id-ID");
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));document.getElementById(id).classList.add("active");if(id==="search")renderSearch();if(id==="cart")renderCart();if(id==="checkout")updatePay();scrollTo(0,0)}
function goSearch(){document.getElementById("searchInput").value=document.getElementById("homeSearch").value||"pizza";show("search")}
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{let f=b.dataset.filter;if(["Pizza","Burger","Pasta","Dessert"].includes(f)){document.getElementById("searchInput").value=f.toLowerCase();show("search")}else if(f==="Kategori"){document.getElementById("searchInput").value="";show("search")}else show("home")}));
function renderSearch(){
 let term=(document.getElementById("searchInput").value||"").toLowerCase();
 let arr=products.filter(p=>p.name.toLowerCase().includes(term)||p.desc.toLowerCase().includes(term)||term==="pizza");
 document.getElementById("searchResults").innerHTML=arr.map((p,i)=>`<div class="result"><img src="${p.img}"><div><b>${p.name}</b><br><small>Harga : ${money(p.price)}</small></div><button onclick="openDetail(${i})">Detail</button></div>`).join("")||'<p style="font-size:10px">Produk tidak ditemukan.</p>';
}
document.getElementById("searchInput").addEventListener("input",renderSearch);
function openDetail(i){current=products[i];basePrice=current.price;qty=1;document.getElementById("dImage").src=current.img;document.getElementById("dName").textContent=current.name+" ENAK BANGET";document.getElementById("dPrice").textContent=money(basePrice);document.getElementById("qty").textContent=1;document.querySelectorAll(".checks input[type=checkbox]").forEach(x=>x.checked=false);show("detail")}
document.querySelectorAll(".sizes button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".sizes button").forEach(x=>x.classList.remove("chosen"));b.classList.add("chosen");basePrice=Number(b.dataset.price);document.getElementById("dPrice").textContent=money(basePrice)}));
function changeQty(d){qty=Math.max(1,qty+d);document.getElementById("qty").textContent=qty}
function addDetail(){let extra=[...document.querySelectorAll(".checks input[type=checkbox]:checked")].reduce((s,x)=>s+Number(x.dataset.extra),0);let item={name:current.name.replace("PIZZA","Pizza Super"),price:basePrice+extra,qty,img:current.img};let old=cart.find(x=>x.name===item.name&&x.price===item.price);old?old.qty+=qty:cart.push(item);renderCart()}
function quickAdd(name){cart.push({name,price:name==="Burger"?25000:30000,qty:1,img:name==="Burger"?"assets/burger.jpg":"assets/ramen.jpg"});show("cart")}
function renderCart(){let box=document.getElementById("cartList");box.innerHTML=cart.map((x,i)=>`<div class="cart-item"><div>${i+1}. ${x.name}<br><b>${money(x.price)}</b></div><div class="cart-controls"><button onclick="changeCart(${i},-1)">−</button><span>${x.qty}</span><button onclick="changeCart(${i},1)">+</button><button class="remove" onclick="removeCart(${i})">×</button></div></div>`).join("")||'<p style="font-size:10px">Keranjang kosong.</p>';let total=cart.reduce((s,x)=>s+x.price*x.qty,0);document.getElementById("cartTotal").textContent=money(total);document.getElementById("payTotal").textContent=money(total)}
function changeCart(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);renderCart()}
function removeCart(i){cart.splice(i,1);renderCart()}
function clearCart(){cart=[];renderCart()}
function updatePay(){let t=cart.reduce((s,x)=>s+x.price*x.qty,0);document.getElementById("payTotal").textContent=money(t)}
function payNow(){if(!document.getElementById("address").value.trim()){alert("Silakan isi alamat pengiriman.");return}show("success")}
renderCart();renderSearch();
