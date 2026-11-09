
const categoryStyle = {
  Beef:          { icon: 'fa-drumstick-bite', color: 'danger' },
  Chicken:       { icon: 'fa-drumstick-bite', color: 'warning' },
  Dessert:       { icon: 'fa-cake-candles',   color: 'info' },
  Lamb:          { icon: 'fa-drumstick-bite', color: 'warning' },
  Miscellaneous: { icon: 'fa-bowl-rice',      color: 'info' },
  Pasta:         { icon: 'fa-bowl-food',      color: 'warning' },
  Pork:          { icon: 'fa-bacon',          color: 'danger' },
  Seafood:       { icon: 'fa-fish',           color: 'info' },
  Side:          { icon: 'fa-bowl-rice',      color: 'success' },
  Starter:       { icon: 'fa-utensils',       color: 'info' },
  Vegan:         { icon: 'fa-leaf',           color: 'success' },
  Vegetarian:    { icon: 'fa-seedling',       color: 'success' },
  Breakfast:     { icon: 'fa-mug-hot',        color: 'warning' },
  Goat:          { icon: 'fa-drumstick-bite', color: 'info' },
};

const categories = document.querySelector("#categories")
const recipes = document.querySelector("#recipes");
const mealDetails = document.querySelector("#mealDetails")
const mealsList = document.querySelector("#mealsList") 
const detailsContent = document.querySelector("#detailsContent")
const productsSection = document.querySelector("#productsSection")
const foodLogSection = document.querySelector("#foodlog-section")
const mealsNav = document.querySelector("#meals")
const ScannerNav =  document.querySelector("#Scanner")
const logNav= document.querySelector("#log")
const navItems = [mealsNav, ScannerNav, logNav]

// ===== URL ====
const routes = {
    "#recipes":  { 
        section: mealsList,
        nav: mealsNav
    },
    "#scanner":
    {
    section: productsSection,
    nav: ScannerNav 
    },
    "#food-log":
    { 
    section: foodLogSection,
    nav: logNav }
}
function handleRoute() {
    const route = routes[location.hash] || routes["#recipes"]
    showPage(route.section, route.nav)
    window.scrollTo(0, 0)
}
window.addEventListener("hashchange", handleRoute)

// =====  EVENTS  =====
function setActive(item) {
    navItems.forEach(n => n.classList.remove("active"))
    item.classList.add("active")
}

// mealsNav.addEventListener("click", (e) => {
//     e.preventDefault()

//     mealDetails.classList.add("d-none")
//     productsSection.classList.add("d-none")
//     foodLogSection.classList.add("d-none")
//     mealsList.classList.remove("d-none")
//     setActive(mealsNav)

// })
// ScannerNav.addEventListener("click", (e) => {
//     e.preventDefault()
//     mealsList.classList.add("d-none")
//     mealDetails.classList.add("d-none")
//     foodLogSection.classList.add("d-none")
//     productsSection.classList.remove("d-none")
//     setActive(ScannerNav)
// })
// logNav.addEventListener("click", (e) => {
//     e.preventDefault()
//     mealsList.classList.add("d-none")
//     mealDetails.classList.add("d-none")
//     productsSection.classList.add("d-none")
//     foodLogSection.classList.remove("d-none")
//     setActive(logNav)
// })

function showPage(section, nav) {
    mealsList.classList.add("d-none")
    mealDetails.classList.add("d-none")
    productsSection.classList.add("d-none")
    foodLogSection.classList.add("d-none")
    section.classList.remove("d-none")
    setActive(nav)
}   
// ===================================================

// ======> SEARCH <===============

const mealSearchIn = document.querySelector("#meal-search-input")

async function searchMeals() {
    const name = mealSearchIn.value.trim()
    if(!name){
        recipes.innerHTML=""
        return
    }
    recipes.innerHTML = `<p class="text-center text-secondary py-5">Loading...</p>`
    const res = await fetch(`https://nutriplan-api.vercel.app/api/meals/search?q=${encodeURIComponent(name)}`)
    const data = await res.json()
    displayMeals(data.results)
}
let searchTimer
mealSearchIn.addEventListener("input", () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(searchMeals, 400)
})
// ===========> AREA_BOX
const areaBox = document.querySelector("#areas")

async function getAreas() {
    const response = await fetch("https://nutriplan-api.vercel.app/api/meals/areas")
    const data = await response.json()

    const names = [...new Set(data.results.map(a => a.name ?? a))]
    displayAreas(names)
}
function displayAreas(names){
     let box = `<button class="area-btn btn btn-sm rounded-pill px-3 py-2 fw-medium active" data-area="">All Cuisines</button>`
    for (let i = 0; i < names.length; i++) {
        box += `<button class="area-btn btn btn-sm rounded-pill px-3 py-2 fw-medium" data-area="${names[i]}">${names[i]}</button>`
    }
    areaBox.innerHTML = box
}

areaBox.addEventListener("click", (e) => {
    const btn = e.target.closest(".area-btn")
    if (!btn) return
    document.querySelectorAll(".area-btn").forEach(b => b.classList.remove("active"))
    btn.classList.add("active")
    mealSearchIn.value = ""  

    getMealsByArea(btn.dataset.area)
})
async function getMealsByArea(area) {
    if (!area) {                           
        recipes.innerHTML = ""
        return
    } 
     recipes.innerHTML = `<p class="text-center text-secondary py-5">Loading...</p>`
    const res = await fetch(`https://nutriplan-api.vercel.app/api/meals/filter?area=${encodeURIComponent(area)}`)
    const data = await res.json()
    displayMeals(data.results)
}   

mealSearchIn.value = ""
async function getCategories() {
    var response = await fetch ("https://nutriplan-api.vercel.app/api/meals/categories")
    const data = await response.json()
    displayCategories(data.results)
}
// =================================================
// ======> MEALS PAGE
// -----   Categories    ----
function displayCategories(list){
    let box = "";
    for(let i = 0 ; i < list.length; i++){
        const cat= list[i]
        const style= categoryStyle[cat.name]
         box += `
             <div class="col-lg-6">
                <div class="category-box d-flex align-items-center gap-2 p-3  rounded-3 border
                            bg-${style.color}-subtle border-${style.color}-subtle"
                    data-category="${cat.name}">
                <div class="icon-square bg-${style.color} text-white rounded-2
                            d-flex align-items-center justify-content-center">
                    <i class="fa-solid ${style.icon}"></i>
                </div>
             <span class="fw-bold fs-6 ">${cat.name}</span>
        </div>
      </div>`
    }
    categories.innerHTML = box

}
getCategories()
getAreas()
// -----------------------------------------
// =====> getMeals_displayMeals

async function getMeals(meal) {
    const res = await fetch(`https://nutriplan-api.vercel.app/api/meals/filter?category=${meal}`)
    const data = await res.json()
    console.log(data)
    displayMeals(data.results)

}

function displayMeals(list){
    if (!list || list.length === 0) {
        recipes.innerHTML = `<p class="text-center text-secondary py-5">No recipes found</p>`
        return
    }
    let box = ""
    for (let i = 0 ; i < list.length; i++){
        let meal = list[i]
        box += `
            <div class="col-lg-4">
                <div class="card h-100 recipe-card" data-meal-id="${meal.id}" role="button">
                    <img src="${meal.thumbnail}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <div class="badges my-3 text-end">
                            <span class="badge bg-warning-subtle text-warning">${meal.category}</span>
                            <span class="badge bg-success-subtle text-success">${meal.area}</span>
                        </div>   
                        <h4 class="card-title fw-bolder">${meal.name}</h4>
                        <p class="card-text text-secondary clamp-2">${meal.instructions?.slice(0, 2).join(" ") ?? ""}</p>
                    </div>
                </div>
            </div>
        `
    }
    recipes.innerHTML = box
}

categories.addEventListener("click",(e)=> {
    const box = e.target.closest(".category-box")
    if (!box) return
    getMeals(box.dataset.category)
})


recipes.addEventListener("click", (e)=>{
    const card = e.target.closest(".recipe-card")
    if (!card) return 
    const id = card.dataset.mealId;

    getId(id)
})

const backBtn = document.querySelector("#backBtn")

backBtn.addEventListener("click", ()=>{
    mealDetails.classList.add("d-none")
    mealsList.classList.remove("d-none")
})

let currentMeal = null;
let currentNutrition = null;
async function getId(id) {
    currentNutrition = null

    const res = await fetch(`https://nutriplan-api.vercel.app/api/meals/${id}`)
    const data = await res.json()
    currentMeal = data.result;
    displayDetails(currentMeal);
    mealsList.classList.add("d-none")
    mealDetails.classList.remove("d-none")

    window.scrollTo(0, 0)
    currentNutrition = await getNutrition(currentMeal);
    displayNutrition(currentNutrition);

}
// =========> displayDetails
function displayDetails(meal){
    let ingredientsBox =""
    for (let i = 0; i < meal.ingredients.length; i++){
        const ing = meal.ingredients[i]
        ingredientsBox +=`
            <div class="col-md-6">
                <div class="bg-light rounded-3 p-3">
                    <span class="fw-bold">${ing.measure}</span> ${ing.ingredient}
                </div>
            </div>`
    }        
            
    let stepsBox = ""
    for (let i = 0; i < meal.instructions.length; i++) {
        stepsBox += `
            <div class="d-flex gap-3 mb-3">
                <div class="step-num bg-success text-white rounded-circle fw-bold
                            d-flex align-items-center justify-content-center">${i + 1}</div>
                <p class="mb-0 pt-2">${meal.instructions[i]}</p>
            </div>`
    }
            
    let videoBox = ""
    if (meal.youtube) {
        const videoId = meal.youtube.split("v=")[1]
        videoBox = `
            <div class="bg-white rounded-4 shadow-sm p-4">
                <h4 class="fw-bold mb-3"><i class="fa-solid fa-video text-danger"></i> Video Tutorial</h4>
                <div class="ratio ratio-16x9">
                    <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen class="rounded-3"></iframe>
                </div>
            </div>`
    }
    detailsContent.innerHTML = `
        <div class="row g-4">
            <div class="col-lg-6">
                <img src="${meal.thumbnail}" alt="${meal.name}" class="img-fluid rounded-4 w-100 mb-3">
                <div class="d-flex gap-2 mb-2">
                    <span class="badge bg-warning-subtle text-warning">${meal.category}</span>
                    <span class="badge bg-success-subtle text-success">${meal.area}</span>
                </div>
                <h2 class="fw-bold mb-4">${meal.name}</h2>
                <div class="d-flex">
                    
                    <button class="logBtn btn btn-primary btn-lg mb-4"><i class="fa-solid fa-list-ul me-2"></i>Log This Meal</button>
                </div>
                
                <div class="bg-white rounded-4 shadow-sm p-4 mb-4">
                    <h4 class="fw-bold mb-3">
                        <i class="fa-solid fa-list-check text-success"></i> Ingredients
                        <span class="fs-6 fw-normal text-secondary float-end">${meal.ingredients.length} items</span>
                    </h4>
                    <div class="row g-2">${ingredientsBox}</div>
                </div>

                <div class="bg-white rounded-4 shadow-sm p-4 mb-4">
                    <h4 class="fw-bold mb-3"><i class="fa-solid fa-shoe-prints text-success"></i> Instructions</h4>
                    ${stepsBox}
                </div>

                ${videoBox}
            </div>

            <div class="col-lg-6">
                <div class="bg-white rounded-4 shadow-sm p-4 sticky-top" style="top: 20px">
                    <h4 class="fw-bold mb-3"><i class="fa-solid fa-chart-pie text-success"></i> Nutrition Facts</h4>
                    <div id="nutrition">
                        <p class="text-secondary">Loading nutrition...</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="logOverlay" class="log-overlay d-none">
            <div class="log-box bg-white rounded-4 p-4">
                <h5 class="fw-bold mb-3"><i class="fa-solid fa-clipboard-list text-primary me-2"></i>Log This Meal</h5>

                <div class="d-flex align-items-center gap-3 bg-light rounded-3 p-3 mb-3">
                    <img src="${meal.thumbnail}" alt="${meal.name}" class="log-img rounded-3">
                    <p class="fw-bold mb-0">${meal.name}</p>
                </div>

                <label for="servingsInput" class="form-label fw-semibold">Number of Servings</label>
                <input type="number" id="servingsInput" class="form-control mb-3 w-50" min="0.5" step="0.5" value="1">

                <p class="small fw-semibold text-secondary mb-2">Estimated nutrition per serving:</p>
                <div class="row row-cols-4 g-2 text-center mb-4">
                    <div class="col"><div class="bg-success-subtle rounded-3 p-2"><p id="logCalories" class="h5 fw-bold text-success mb-0">0</p><p class="small text-secondary mb-0">Calories</p></div></div>
                    <div class="col"><div class="bg-primary-subtle rounded-3 p-2"><p id="logProtein" class="h5 fw-bold text-primary mb-0">0g</p><p class="small text-secondary mb-0">Protein</p></div></div>
                    <div class="col"><div class="bg-warning-subtle rounded-3 p-2"><p id="logCarbs" class="h5 fw-bold text-warning mb-0">0g</p><p class="small text-secondary mb-0">Carbs</p></div></div>
                    <div class="col"><div class="fat-card rounded-3 p-2"><p id="logFat" class="h5 fw-bold mb-0 text-fat">0g</p><p class="small text-secondary mb-0">Fat</p></div></div>
                </div>

                <div class="d-flex justify-content-end gap-2">
                    <button id="cancelLogBtn" class="btn btn-light">Cancel</button>
                    <button id="confirmLogBtn" class="btn btn-success px-4">Log Meal</button>
                </div>
            </div>
        </div>
        `
}
/* page  Product Scanner*/
// ====> OOP 
class ProductApi{
    async searchName(name){
        const res = await fetch(`https://nutriplan-api.vercel.app/api/products/search?q=${encodeURIComponent(name)}`)
        const data = await res.json()
        console.log(data)
        return data.results
    }
    async searchcode(barcode){
        const res = await fetch(`https://nutriplan-api.vercel.app/api/products/barcode/${encodeURIComponent(barcode)}`)
        const data = await res.json()
        console.log(data)
        return data.result
    }
}

const productsGrid = document.querySelector("#products-grid")
const api = new ProductApi()
const gradeColor = { a: "#22c55e", b: "#84cc16", c: "#eab308", d: "#f97316", e: "#ef4444" }

let currentProducts = []

function displayProducts(products){
    if (!products) products = []
    if (!Array.isArray(products))
    products = [products]
    currentProducts = products
    if (products.length === 0) {
        productsGrid.innerHTML = `<p class="text-center text-secondary py-5">No products found</p>`
        return
    }
    let box = ""
    for (let i = 0 ; i < products.length; i++){
        let product = products[i]
        let n = product.nutrients || {}
        box +=`
        <div class="col-12 col-md-6 col-lg-4 col-xl-3">
            <div class="product-card card h-100 border-0 shadow-sm overflow-hidden" data-barcode="${product.barcode}" role="button">
                <div class="product-img position-relative bg-light">
                    <img src="${product.image}"
                        alt="${product.name}" class="w-100 h-100" loading="lazy">
                    <span class="position-absolute top-0 start-0 m-2 badge text-uppercase nutri-badge"      style="background:${gradeColor[product.nutritionGrade] || '#9ca3af'}">Nutri-Score ${product.nutritionGrade ?? "?"}</span>
                </div> 
                <div class="card-body">
                    <p class="small fw-semibold text-success mb-1 text-truncate">${product.brand ?? ""}</p>
                    <h3 class="product-name fs-6 fw-bold mb-2 clamp-2">${product.name}</h3>

                    <div class="d-flex gap-3 small text-secondary mb-3">
                        <span><i class="fa-solid fa-fire me-1"></i>${n.calories ?? "-"} kcal/100g</span>
                    </div>
                    <div class="row row-cols-4 g-1 text-center">
                        <div class="col"><div class="mini mini-protein rounded p-1"><p class="fw-bold mb-0">${n.protein ?? "-"}g</p><p class="mini-label mb-0">Protein</p></div></div>
                        <div class="col"><div class="mini mini-carbs rounded p-1"><p class="fw-bold mb-0">${n.carbs ?? "-"}g</p><p class="mini-label mb-0">Carbs</p></div></div>
                        <div class="col"><div class="mini mini-fat rounded p-1"><p class="fw-bold mb-0">${n.fat ?? "-"}g</p><p class="mini-label mb-0">Fat</p></div></div>
                        <div class="col"><div class="mini mini-sugar rounded p-1"><p class="fw-bold mb-0">${n.sugar ?? "-"}g</p><p class="mini-label mb-0">Sugar</p></div></div>
                    </div>
                </div>
            </div>
        </div>          
        `
    }    
    productsGrid.innerHTML = box

}

// ===> Search by Product Name
const searchInput = document.querySelector("#product-search-input")
const searchProBtn = document.querySelector("#search-product-btn")


async function searchByName() {
 const name = searchInput.value.trim() 
    if (!name)
    return 

    const products = await api.searchName(name) 
    displayProducts(products)    
}
searchProBtn.addEventListener("click", searchByName) 
searchInput.addEventListener("keydown", (e)=>{
    if (e.key === "Enter") {
      searchByName()
    }  
})

// ====> search by barcode

const barcodeBtn = document.querySelector("#lookup-barcode-btn")
const barcodeIn = document.querySelector("#barcode-input")

async function searchByBarcode() {
 const barcode = barcodeIn.value.trim() 
    if (!barcode)
    return 

    const product = await api.searchcode(barcode)
    displayProducts(product)    
}
barcodeBtn.addEventListener("click", searchByBarcode) 
barcodeIn.addEventListener("keydown", (e)=>{
    if (e.key === "Enter") {
      searchByBarcode()
    }
})

const productModal = document.querySelector("#productModal")
const productMContent = document.querySelector("#productModalContent")
let selectedProduct = null

function productsModal(product){
    selectedProduct = product 
    const n = product.nutrients || {}

       productMContent.innerHTML = `
        <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="d-flex gap-3">
                <img src="${product.image}" alt="${product.name}" class="log-img rounded-3" style="width:90px;height:90px;object-fit:contain">
                <div>
                    <p class="small fw-semibold text-success mb-1">${product.brand ?? ""}</p>
                    <h4 class="fw-bold mb-1">${product.name}</h4>
                    <span class="badge text-uppercase" style="background:${gradeColor[product.nutritionGrade] || '#9ca3af'}">
                        Nutri-Score ${product.nutritionGrade ?? "?"}
                    </span>
                </div>
            </div>
            <button id="closeProductModal" class="btn btn-light btn-sm"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="bg-success-subtle rounded-3 p-3 mb-3">
            <h6 class="fw-bold mb-3">Nutrition Facts <span class="fw-normal text-secondary">(per 100g)</span></h6>
            <p class="h2 fw-bold text-center mb-3">${Math.round(n.calories) ?? "-"} <span class="fs-6 text-secondary">Calories</span></p>
            <div class="row row-cols-4 text-center g-2">
                <div class="col"><p class="fw-bold text-success mb-0">${Math.round(n.protein) ??  "-"}g</p><small class="text-secondary">Protein</small></div>
                <div class="col"><p class="fw-bold text-primary mb-0">${Math.round(n.carbs) ??"-"}g</p><small class="text-secondary">Carbs</small></div>
                <div class="col"><p class="fw-bold text-fat mb-0">${Math.round(n.fat) ?? "-"}g</p><small class="text-secondary">Fat</small></div>
                <div class="col"><p class="fw-bold text-danger mb-0">${Math.round(n.sugar) ?? "-"}g</p><small class="text-secondary">Sugar</small></div>
            </div>
        </div>
        
        
        
        <div class="d-flex gap-2">
            <button id="logProductBtn" class="btn btn-success flex-grow-1"><i class="fa-solid fa-plus me-2"></i>Log This Food</button>
            <button id="closeProductBtn" class="btn btn-light flex-grow-1">Close</button>
        </div>
    `
    productModal.classList.remove("d-none")

}

productsGrid.addEventListener("click", async (e) => {
    const card = e.target.closest(".product-card")
    if (!card) return

    const full = await api.searchcode(card.dataset.barcode)
    console.log(full)                       
    if (full) productsModal(full)
})

productModal.addEventListener("click", (e) => {
    if (e.target === productModal || e.target.closest("#closeProductModal") || e.target.closest("#closeProductBtn")) {
        productModal.classList.add("d-none")
    }
    if (e.target.closest("#logProductBtn") && selectedProduct) {
        const n = selectedProduct.nutrients || {}
        const entry = {
            id: Date.now(),
            type: "product",
            date: today(),
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            name: selectedProduct.name,
            thumbnail: selectedProduct.image,
            servings: 1,
            calories: n.calories ?? 0,
            protein: n.protein ?? 0,
            carbs: n.carbs ?? 0,
            fat: n.fat ?? 0
        }
        const log = getLog()
        log.push(entry)
        saveLog(log)
        productModal.classList.add("d-none")
        renderLog()
        Swal.fire({ icon: "success", title: "Food Logged!", text: `${entry.name} was added to your Food Log`, timer: 1800, showConfirmButton: false })
    }
})
// ======================================
// =====> DATE
const dateKey = (d = new Date()) => d.toLocaleDateString()
const today = () => dateKey()
function getWeekDays() {
    const now = new Date()
    const dayIndex = (now.getDay() + 6) % 7      
    const monday = new Date(now)
    monday.setDate(now.getDate() - dayIndex)

    const days = []
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        days.push(d)
    }
    return days
}   
const weeklyChart = document.querySelector("#weekly-chart")

function renderWeek() {
    const log = getLog()
    const todayKey = dateKey()
    const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const days = getWeekDays()

    let box = ""
    for (let i = 0; i < days.length; i++) {
        const key = dateKey(days[i])
        const kcal = log
            .filter(e => e.date === key)
            .reduce((sum, e) => sum + e.calories, 0)
        const isToday = key === todayKey

        box += `
            <div class="week-day text-center rounded-4 p-2 flex-fill ${isToday ? "week-today" : ""}">
                <p class="text-secondary mb-1">${names[i]}</p>
                <p class="fw-medium mb-2">${days[i].getDate()}</p>
                <p class="h3 fw-bold mb-0 ${kcal ? "text-success" : "text-secondary opacity-25"}">${Math.round(kcal)}</p>
                <p class="small text-secondary mb-0 ${kcal ? "" : "opacity-25"}">kcal</p>
            </div>`
    }
    weeklyChart.innerHTML = box
} 

detailsContent.addEventListener("click", (e) => {
    const overlay = document.querySelector("#logOverlay")
     if (e.target.closest(".logBtn")) {
        if (!currentNutrition)
            return
        document.querySelector("#logCalories").textContent = Math.round(currentNutrition.calories)
        document.querySelector("#logProtein").textContent = `${Math.round(currentNutrition.protein)}g`
        document.querySelector("#logCarbs").textContent = `${Math.round(currentNutrition.carbs)}g`
        document.querySelector("#logFat").textContent = `${Math.round(currentNutrition.fat)}g`
        overlay.classList.remove("d-none")
    }
    if (e.target.closest("#cancelLogBtn") || e.target === overlay) {
        overlay.classList.add("d-none")
    }
    if (e.target.closest("#confirmLogBtn")) {
        const servings = Number(document.querySelector("#servingsInput").value)
        if (!servings || servings <= 0) return

        const entry = {
            id: Date.now(),
            type: "recipe",
            date: today(),
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            name: currentMeal.name,
            thumbnail: currentMeal.thumbnail,
            servings: servings,
            calories: currentNutrition.calories * servings,
            protein: currentNutrition.protein * servings,
            carbs: currentNutrition.carbs * servings,
            fat: currentNutrition.fat * servings
        }

        const log = getLog()
        log.push(entry)
        saveLog(log)

        overlay.classList.add("d-none")
        renderLog()
        Swal.fire({ icon: "success", title: "Meal Logged!", text: `${entry.name} was added to your Food Log`, timer: 1800, showConfirmButton: false })
    }
})



// ============================================
// ==== POST

const USDA_KEY = "WrB9MGKF8fQtpGndqCJD7knGkhK8F8JNFbQMdzmG"

async function getNutrition(meal) {
    try {
        const res = await fetch("https://nutriplan-api.vercel.app/api/nutrition/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": USDA_KEY
            },
            body: JSON.stringify({
                recipeName: meal.name,
                ingredients: meal.ingredients.map(ing => `${ing.measure} ${ing.ingredient}`)
            })
        })
        const data = await res.json()
        console.log(data)

        if (!data.success) throw new Error("Analyze failed")

        const t = data.data.totals
        const s = data.data.servings || 4      

        return {
            calories: t.calories / s,         
            protein: t.protein / s,
            carbs: t.carbs / s,
            fat: t.fat / s,
            fiber: t.fiber / s,
            sugar: t.sugar / s,
            saturatedFat: t.saturatedFat / s,
            totalCalories: t.calories
        }
    } catch (error) {
        console.log(error)
        return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, saturatedFat: 0, totalCalories: 0 }    }
}
function displayNutrition(nutrition) {
    const nutritionBox = document.querySelector("#nutrition")

        nutritionBox .innerHTML = `
        <div class="row g-3 text-center">

            <div class="col-6">
                <div class="bg-success-subtle rounded-3 p-3">
                    <h3 class="fw-bold text-success">
                        ${Math.round(nutrition.calories)}
                    </h3>
                    <p class="mb-0 text-secondary">Calories</p>
                </div>
            </div>

            <div class="col-6">
                <div class="bg-primary-subtle rounded-3 p-3">
                    <h3 class="fw-bold text-primary">
                        ${Math.round(nutrition.protein)}g
                    </h3>
                    <p class="mb-0 text-secondary">Protein</p>
                </div>
            </div>

            <div class="col-6">
                <div class="bg-warning-subtle rounded-3 p-3">
                    <h3 class="fw-bold text-warning">
                        ${Math.round(nutrition.carbs)}g
                    </h3>
                    <p class="mb-0 text-secondary">Carbs</p>
                </div>
            </div>

            <div class="col-6">
                <div class="fat-card rounded-3 p-3">
                    <h3 class="fw-bold text-fat">
                        ${Math.round(nutrition.fat)}g
                    </h3>
                    <p class="mb-0 text-secondary">Fat</p>
                </div>
            </div>
            <div class="col-6">
                <div class="bg-info-subtle rounded-3 p-3">
                    <h3 class="fw-bold text-info">
                        ${Math.round(nutrition.fiber)}g
                    </h3>
                    <p class="mb-0 text-secondary">Fiber</p>
                </div>
            </div>
            <div class="col-6">
                <div class="bg-danger-subtle rounded-3 p-3">
                    <h3 class="fw-bold text-danger">
                        ${Math.round(nutrition.sugar)}g
                    </h3>
                    <p class="mb-0 text-secondary">Sugar</p>
                </div>
            </div>
            <div class="col-12">
                <div class="bg-light rounded-3 p-3">
                    <h3 class="fw-bold text-dark">
                        ${Math.round(nutrition.saturatedFat)}g
                    </h3>
                    <p class="mb-0 text-secondary">Saturated Fat</p>
                </div>
            </div>

        </div>
    `;
}

// ==========================================
// Food Log page
document.querySelector("#foodlog-date").textContent =
    new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric" 
    })

function updateRing(name, value, unit) {
const real = Math.round((value / GOALS[name]) * 100)       // النسبة الحقيقية
document.querySelector(`#${name}-ring`).style.setProperty("--p", Math.min(100, real))
document.querySelector(`#${name}-percent`).textContent = `${real}%`
document.querySelector(`#${name}-value`).textContent = `${Math.round(value)} ${unit}`
}
const GOALS = {
    calories: 2000,
    protein: 50,
    carbs: 250,
    fat: 65
}
const loggedList = document.querySelector("#logged-items-list")
const emptyState = `
    <div class="text-center py-4 text-secondary">
        <i class="fa-solid fa-utensils fs-1 mb-3 opacity-25"></i>
        <p class="fw-medium mb-1">No meals logged today</p>
        <p class="small mb-0">Add meals from the Meals page or scan products</p>
    
        <div class="d-flex justify-content-center gap-2 flex-wrap p-4">
            <button id="goRecipes" class="btn btn-success px-4 py-2">
                <i class="fa-solid fa-plus me-2"></i>Browse Recipes
            </button>
            <button id="goScanner" class="btn btn-primary px-4 py-2">
                <i class="fa-solid fa-barcode me-2"></i>Scan Product
            </button>
        </div>
    </div>`


loggedList.addEventListener("click", (e) => {
    if (e.target.closest("#goRecipes")) showPage(mealsList, mealsNav)
    if (e.target.closest("#goScanner")) showPage(productsSection, ScannerNav)
})

// const today  = ()=>
//     new Date().toLocaleDateString()

const getLog = () =>
    JSON.parse(localStorage.getItem("foodLog")) || []

const saveLog = (list) =>
    localStorage.setItem("foodLog", JSON.stringify(list))

function renderLog(){
    const items = getLog().filter(e => 
        e.date === today()
    )
    const total = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    } 
    let box = ""
    for(let i = 0; i < items.length; i++){
        const item = items[i]
        total.calories += item.calories
        total.protein += item.protein
        total.carbs += item.carbs
        total.fat += item.fat

        box+= `
            <div class="d-flex align-items-center gap-3 bg-light rounded-4 p-3 mb-2">
                <img src="${item.thumbnail}" alt="${item.name}" class="logged-img rounded-3">
                <div class="flex-grow-1">
                    <p class="fw-bold fs-5 mb-0">${item.name}</p>
                    <p class="text-secondary mb-0">
                        ${item.servings} serving${item.servings > 1 ? "s" : ""}
                        <span class="mx-1">•</span>
                        <span class="text-success">${item.type === "product" ? "Product" : "Recipe"}</span>
                    </p>
                    <p class="small text-secondary mb-0">${item.time}</p>
                </div>
                <div class="text-center px-2">
                    <p class="h3 fw-bold text-success mb-0">${Math.round(item.calories)}</p>
                    <p class="small text-secondary mb-0">kcal</p>
                </div>
                <button class="btn text-secondary remove-item" data-id="${item.id}" title="Remove">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `
    }
    loggedList.innerHTML = items.length ? box : emptyState
    document.querySelector("#logged-count").textContent = items.length
    document.querySelector("#clear-foodlog").classList.toggle("d-none", items.length === 0)

    updateRing("calories", total.calories, "kcal")
    updateRing("protein", total.protein, "g")
    updateRing("carbs", total.carbs, "g")
    updateRing("fat", total.fat, "g")

    renderWeek()
}
loggedList.addEventListener("click", (e) => {
    if (e.target.closest("#goRecipes")) location.hash = "#recipes"
    if (e.target.closest("#goScanner")) location.hash = "#scanner"
})
loggedList.addEventListener("click", (e)=>{
    const btn = e.target.closest(".remove-item")
    if (!btn) return
    saveLog(getLog().filter(x => x.id !== Number(btn.dataset.id)))
    renderLog()
})

document.querySelector("#clear-foodlog").addEventListener("click", () => {
    saveLog(getLog().filter(x => x.date !== today()))
    renderLog()
})
renderLog()
handleRoute()

    