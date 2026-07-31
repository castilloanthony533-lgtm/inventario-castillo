import React,{useMemo,useState} from 'react'
import {createRoot} from 'react-dom/client'
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from 'recharts'
import {LayoutDashboard,Package,Users,ScanLine,Plus,Search,Trash2,Edit3,AlertTriangle,LogOut,Menu,X,Save} from 'lucide-react'
import './index.css'

const initial=[
{id:1,producto:'Filtro de aceite',categoria:'Filtros',stock:24,minimo:10,proveedor:'Sakura',costo:80,venta:120},
{id:2,producto:'Bombillo H4 LED',categoria:'Iluminación',stock:8,minimo:10,proveedor:'Wenye',costo:250,venta:350},
{id:3,producto:'Stop Toyota Hilux',categoria:'Carrocería',stock:15,minimo:5,proveedor:'DEPO',costo:1450,venta:1900},
{id:4,producto:'Cinta de pito',categoria:'Eléctrico',stock:4,minimo:6,proveedor:'Castillo',costo:320,venta:450},
{id:5,producto:'Filtro de aire',categoria:'Filtros',stock:18,minimo:8,proveedor:'Sakura',costo:110,venta:160}
]
const users=['Administrador','Vendedor 1','Vendedor 2','Bodega']

function App(){
 const [products,setProducts]=useState(initial),[view,setView]=useState('dashboard'),[search,setSearch]=useState(''),[user,setUser]=useState(users[0]),[menu,setMenu]=useState(false),[scan,setScan]=useState(false),[editing,setEditing]=useState(null)
 const total=products.reduce((s,p)=>s+p.stock*p.costo,0)
 const low=products.filter(p=>p.stock<p.minimo)
 const filtered=products.filter(p=>Object.values(p).join(' ').toLowerCase().includes(search.toLowerCase()))
 const chart=useMemo(()=>Object.values(products.reduce((a,p)=>(a[p.categoria]??={categoria:p.categoria,stock:0},a[p.categoria].stock+=p.stock,a),{})),[products])
 const add=()=>setProducts(p=>[...p,{id:Date.now(),producto:'Nuevo producto',categoria:'General',stock:0,minimo:1,proveedor:'',costo:0,venta:0}])
 const remove=id=>setProducts(p=>p.filter(x=>x.id!==id))
 const update=(id,k,v)=>setProducts(p=>p.map(x=>x.id===id?{...x,[k]:['stock','minimo','costo','venta'].includes(k)?Number(v):v}:x))
 return <div className="min-h-screen">
  <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-lg">
   <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
    <div className="flex items-center gap-3"><button onClick={()=>setMenu(!menu)} className="rounded-lg p-2 hover:bg-slate-800"><Menu size={22}/></button><div><b className="text-lg">Inventario Castillo</b><div className="text-xs text-slate-300">Repuestos y autopartes</div></div></div>
    <div className="flex items-center gap-2"><select value={user} onChange={e=>setUser(e.target.value)} className="rounded-lg bg-slate-800 px-2 py-2 text-sm">{users.map(u=><option key={u}>{u}</option>)}</select><LogOut size={19}/></div>
   </div>
  </header>
  {menu&&<div className="fixed inset-0 z-40 bg-black/30" onClick={()=>setMenu(false)}><aside onClick={e=>e.stopPropagation()} className="h-full w-72 bg-white p-5 shadow-xl"><div className="mb-6 flex justify-between"><b>Menú</b><button onClick={()=>setMenu(false)}><X/></button></div>{[['dashboard','Dashboard',LayoutDashboard],['products','Productos',Package],['users','Usuarios',Users],['scan','Escanear',ScanLine]].map(([k,n,I])=><button key={k} onClick={()=>{setView(k);setMenu(false)}} className="mb-2 flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-slate-100"><I size={19}/>{n}</button>)}</aside></div>}
  <main className="mx-auto max-w-7xl p-4 sm:p-6">
   {view==='dashboard'&&<><div className="mb-5"><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-slate-500">Resumen del inventario</p></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
     <K title="Valor total" value={'L '+total.toLocaleString('es-HN',{minimumFractionDigits:2})}/>
     <K title="Productos" value={products.length}/>
     <K title="Unidades" value={products.reduce((s,p)=>s+p.stock,0)}/>
     <K title="Alertas" value={low.length} danger/>
    </div>
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
     <section className="rounded-2xl bg-white p-4 shadow-sm"><h2 className="mb-4 font-semibold">Stock por categoría</h2><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={chart}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="categoria"/><YAxis/><Tooltip/><Bar dataKey="stock" name="Stock"/></BarChart></ResponsiveContainer></div></section>
     <section className="rounded-2xl bg-white p-4 shadow-sm"><h2 className="mb-3 font-semibold">Alertas de stock</h2>{low.length?low.map(p=><div key={p.id} className="mb-2 flex items-center gap-3 rounded-xl bg-red-50 p-3 text-red-700"><AlertTriangle size={19}/><div><b>{p.producto}</b><div className="text-sm">Stock {p.stock} / mínimo {p.minimo}</div></div></div>):<p className="text-slate-500">No hay productos por debajo del mínimo.</p>}</section>
    </div>
   </>}
   {view==='products'&&<section className="rounded-2xl bg-white p-4 shadow-sm">
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold">Productos</h1><p className="text-slate-500">Tabla editable de inventario</p></div><button onClick={add} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white"><Plus size={18}/>Agregar</button></div>
    <div className="mb-4 flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar producto, código, proveedor..." className="w-full bg-transparent outline-none"/></div>
    <div className="overflow-x-auto"><table className="min-w-[1050px] w-full text-sm"><thead><tr className="border-b text-left text-slate-500">{['ID','Producto','Categoría','Stock','Mínimo','Proveedor','Costo','Precio venta','Estado','Acciones'].map(x=><th className="p-3" key={x}>{x}</th>)}</tr></thead><tbody>{filtered.map(p=><tr key={p.id} className={p.stock<p.minimo?'bg-red-50':''}>{['producto','categoria','stock','minimo','proveedor','costo','venta'].map(k=><td className="p-2" key={k}>{k==='producto'&&<span className="mr-2 text-slate-400">{p.id}</span>}{k!=='producto'||p.id!==p.id?<input/>:<input value={p[k]} onChange={e=>update(p.id,k,e.target.value)} className="w-full rounded-lg border px-2 py-1"/>}</td>)}<td className="p-2">{p.stock<p.minimo?<span className="rounded-full bg-red-100 px-2 py-1 text-red-700">Bajo</span>:<span className="rounded-full bg-green-100 px-2 py-1 text-green-700">Disponible</span>}</td><td className="p-2"><button onClick={()=>remove(p.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={18}/></button></td></tr>)}</tbody></table></div>
   </section>}
   {view==='users'&&<section className="rounded-2xl bg-white p-5 shadow-sm"><h1 className="text-2xl font-bold">Usuarios</h1><p className="mb-5 text-slate-500">Acceso preparado para 4 usuarios.</p><div className="grid gap-3 sm:grid-cols-2">{users.map((u,i)=><div className="rounded-xl border p-4" key={u}><b>{u}</b><p className="text-sm text-slate-500">{i===0?'Administrador':'Usuario operativo'}</p></div>)}</div></section>}
   {view==='scan'&&<section className="rounded-2xl bg-white p-5 shadow-sm"><h1 className="text-2xl font-bold">Escaneo de productos</h1><p className="mb-5 text-slate-500">En iPhone puedes usar la cámara con un lector de códigos integrado en la versión publicada.</p><button onClick={()=>setScan(!scan)} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white"><ScanLine/> {scan?'Cerrar escáner':'Abrir escáner'}</button>{scan&&<div className="mt-5 flex h-72 items-center justify-center rounded-2xl bg-slate-950 text-white"><div className="text-center"><ScanLine size={60} className="mx-auto mb-3"/><p>Área del escáner</p><p className="text-sm text-slate-400">Conecta una librería de cámara al publicar la app.</p></div></div>}</section>}
  </main>
  <footer className="safe-bottom mx-auto max-w-7xl px-4 pb-6 text-center text-xs text-slate-500">Inventario Castillo · Diseño responsivo para PC, Android y iPhone</footer>
 </div>
}
function K({title,value,danger}){return <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{title}</p><p className={'mt-1 text-2xl font-bold '+(danger?'text-red-600':'')}>{value}</p></div>}
createRoot(document.getElementById('root')).render(<App/>)
