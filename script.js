// VSD Cars World — front-end demo. Replace these contact details before publishing.
const WHATSAPP_NUMBER = "918123940634"; // VSD Cars World WhatsApp number
const PHONE_NUMBER = "+918123940634";   // VSD Cars World contact number
const STORAGE_KEY = "vsdCarsWorldListings";
const sampleCars = [
 {id:"sample1",brand:"Maruti Suzuki",model:"Brezza VXi",price:850000,year:2022,km:32000,type:"Used",fuel:"Petrol",transmission:"Manual",location:"Hyderabad",description:"Well-maintained compact SUV. Contact us for details.",photo:"",sample:true},
 {id:"sample2",brand:"Hyundai",model:"Creta SX",price:1250000,year:2021,km:41000,type:"Used",fuel:"Diesel",transmission:"Manual",location:"Hyderabad",description:"Comfortable family SUV with great features.",photo:"",sample:true},
 {id:"sample3",brand:"Tata",model:"Nexon EV",price:1450000,year:2023,km:18000,type:"Used",fuel:"Electric",transmission:"Automatic",location:"Hyderabad",description:"Electric SUV. Ask us for battery and service details.",photo:"",sample:true}
];
let cars = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || sampleCars;
const $ = id => document.getElementById(id);
const money = n => "₹" + Number(n).toLocaleString("en-IN");
const escapeHTML = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(cars));render();}
function waLink(text){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;}
function render(){
 const q=$("searchInput").value.toLowerCase(),brand=$("brandFilter").value,type=$("typeFilter").value,max=Number($("priceFilter").value||0);
 const brands=[...new Set(cars.map(c=>c.brand))].sort();const old=$("brandFilter").value;
 $("brandFilter").innerHTML='<option value="">All brands</option>'+brands.map(b=>`<option>${escapeHTML(b)}</option>`).join("");$("brandFilter").value=brands.includes(old)?old:"";
 const shown=cars.filter(c=>(!q||`${c.brand} ${c.model} ${c.location}`.toLowerCase().includes(q))&&(!brand||c.brand===brand)&&(!type||c.type===type)&&(!max||c.price<max));
 $("resultCount").textContent=`${shown.length} car${shown.length===1?"":"s"} available`;
 $("carGrid").innerHTML=shown.map(c=>`<article class="car-card"><div class="car-photo">${c.photo?`<img src="${c.photo}" alt="${escapeHTML(c.brand+" "+c.model)}">`:"🚘"}</div><div class="car-info"><h3>${escapeHTML(c.brand)} ${escapeHTML(c.model)}</h3><div class="car-price">${money(c.price)}</div><div class="car-meta">${c.year} · ${Number(c.km||0).toLocaleString("en-IN")} km · ${escapeHTML(c.fuel)} · ${escapeHTML(c.transmission)}<br>${escapeHTML(c.location||"Contact for location")} · ${escapeHTML(c.type)}</div><p>${escapeHTML(c.description||"Contact VSD Cars World for more details.")}</p><div class="card-actions"><a href="${waLink(`Hello VSD Cars World, I am interested in the ${c.year} ${c.brand} ${c.model} listed for ${money(c.price)}. Please share more details.`)}" target="_blank" rel="noopener">WhatsApp Enquiry</a><a href="tel:${PHONE_NUMBER}">Call</a></div></div></article>`).join("");
 $("emptyState").classList.toggle("hidden",shown.length>0);
 $("adminList").innerHTML=cars.map(c=>`<div class="admin-row"><span><b>${escapeHTML(c.brand)} ${escapeHTML(c.model)}</b> — ${money(c.price)} ${c.sample?"(sample)":""}</span><span><button onclick="editCar('${c.id}')">Edit</button><button onclick="deleteCar('${c.id}')">Delete</button></span></div>`).join("");
}
function resetForm(){$("carForm").reset();$("editId").value="";$("saveCarBtn").textContent="Add Car Listing";$("cancelEdit").classList.add("hidden");}
window.editCar=id=>{const c=cars.find(x=>x.id===id);if(!c)return;$("editId").value=id;["Brand","Model","Price","Year","Km","Type","Fuel","Transmission","Location","Description"].forEach(k=>{const key=k.toLowerCase();$("car"+k).value=c[key]??"";});$("saveCarBtn").textContent="Save Changes";$("cancelEdit").classList.remove("hidden");$("admin").scrollIntoView({behavior:"smooth"});};
window.deleteCar=id=>{if(confirm("Delete this car listing?")){cars=cars.filter(c=>c.id!==id);save();}};
$("carForm").addEventListener("submit",async e=>{e.preventDefault();const id=$("editId").value;const existing=cars.find(c=>c.id===id);let photo=existing?.photo||"";const file=$("carPhoto").files[0];if(file){if(file.size>1800000){alert("Please choose an image smaller than 1.8 MB for this browser demo.");return;}photo=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});}
 const car={id:id||"car"+Date.now(),brand:$("carBrand").value.trim(),model:$("carModel").value.trim(),price:Number($("carPrice").value),year:Number($("carYear").value),km:Number($("carKm").value||0),type:$("carType").value,fuel:$("carFuel").value,transmission:$("carTransmission").value,location:$("carLocation").value.trim(),description:$("carDescription").value.trim(),photo};
 if(existing)cars=cars.map(c=>c.id===id?car:c);else cars.unshift(car);save();resetForm();$("buy").scrollIntoView({behavior:"smooth"});
});
$("cancelEdit").addEventListener("click",resetForm);
["searchInput","brandFilter","typeFilter","priceFilter"].forEach(id=>$(id).addEventListener(id==="searchInput"?"input":"change",render));
$("menuToggle").addEventListener("click",()=>$("nav").classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>$("nav").classList.remove("open")));
$("whatsappLink").href=waLink("Hello VSD Cars World, I would like to enquire about buying or selling a car.");
document.querySelector('a[href^="tel:"]').href="tel:"+PHONE_NUMBER;
$("year").textContent=new Date().getFullYear();
render();
