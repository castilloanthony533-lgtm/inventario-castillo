import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  DollarSign
} from 'lucide-react'
import './index.css'

const USUARIOS = [
  {
    usuario: 'admin',
    password: 'Admin123',
    nombre: 'Administrador',
    rol: 'Administrador'
  },
  {
    usuario: 'vendedor1',
    password: 'Venta123',
    nombre: 'Vendedor 1',
    rol: 'Vendedor'
  },
  {
    usuario: 'vendedor2',
    password: 'Venta456',
    nombre: 'Vendedor 2',
    rol: 'Vendedor'
  },
  {
    usuario: 'bodega',
    password: 'Bodega123',
    nombre: 'Bodega',
    rol: 'Bodega'
  }
]

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const iniciarSesion = (e) => {
    e.preventDefault()

    const encontrado = USUARIOS.find(
      (u) =>
        u.usuario === usuario.trim() &&
        u.password === password
    )

    if (!encontrado) {
      setError('Usuario o contraseña incorrectos')
      return
    }

    setError('')
    onLogin(encontrado)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          📦
        </div>

        <h1>Inventario Castillo</h1>
        <p className="login-subtitle">
          Sistema de gestión de inventario
        </p>

        <form onSubmit={iniciarSesion}>
          <label>Usuario</label>

          <input
            type="text"
            placeholder="Escribe tu usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
          />

          <label>Contraseña</label>

          <input
            type="password"
            placeholder="Escribe tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && (
            <div className="login-error">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>

        <div className="login-help">
          <p>Usuarios iniciales:</p>
          <small>admin · vendedor1 · vendedor2 · bodega</small>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ usuario, onLogout }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const productos = [
    {
      id: 1,
      producto: 'Filtro de aceite',
      categoria: 'Filtros',
      stock: 15,
      minimo: 10,
      precio: 250
    },
    {
      id: 2,
      producto: 'Foco H7 LED',
      categoria: 'Iluminación',
      stock: 5,
      minimo: 8,
      precio: 850
    },
    {
      id: 3,
      producto: 'Banda Toyota',
      categoria: 'Motor',
      stock: 20,
      minimo: 5,
      precio: 450
    }
  ]

  const valorInventario = productos.reduce(
    (total, producto) =>
      total + producto.stock * producto.precio,
    0
  )

  const productosBajos = productos.filter(
    (producto) => producto.stock <= producto.minimo
  )

  return (
    <div className="app">
      <header className="topbar">
        <button
          className="menu-button"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? <X /> : <Menu />}
        </button>

        <div className="brand">
          📦 Inventario Castillo
        </div>

        <div className="user-info">
          <div>
            <strong>{usuario.nombre}</strong>
            <span>{usuario.rol}</span>
          </div>

          <button
            className="logout-button"
            onClick={onLogout}
            title="Cerrar sesión"
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      <aside className={menuAbierto ? 'sidebar open' : 'sidebar'}>
        <div className="sidebar-title">
          Inventario Castillo
        </div>

        <button>
          <LayoutDashboard size={19} />
          Dashboard
        </button>

        <button>
          <Package size={19} />
          Productos
        </button>

        <button>
          <Users size={19} />
          Usuarios
        </button>

        <button
          onClick={onLogout}
          className="sidebar-logout"
        >
          <LogOut size={19} />
          Cerrar sesión
        </button>
      </aside>

      <main className="content">
        <div className="welcome">
          <h2>Dashboard</h2>
          <p>
            Bienvenido, {usuario.nombre}.
          </p>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon">
              <Package />
            </div>

            <div>
              <span>Productos</span>
              <strong>{productos.length}</strong>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon">
              <DollarSign />
            </div>

            <div>
              <span>Valor del inventario</span>
              <strong>
                L {valorInventario.toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="kpi-card warning">
            <div className="kpi-icon">
              <AlertTriangle />
            </div>

            <div>
              <span>Stock bajo</span>
              <strong>{productosBajos.length}</strong>
            </div>
          </div>
        </div>

        <section className="panel">
          <div className="panel-header">
            <h3>Inventario actual</h3>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Mínimo</th>
                  <th>Precio</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {productos.map((producto) => {
                  const stockBajo =
                    producto.stock <= producto.minimo

                  return (
                    <tr
                      key={producto.id}
                      className={stockBajo ? 'stock-bajo' : ''}
                    >
                      <td>{producto.id}</td>
                      <td>{producto.producto}</td>
                      <td>{producto.categoria}</td>
                      <td>{producto.stock}</td>
                      <td>{producto.minimo}</td>
                      <td>
                        L {producto.precio.toLocaleString()}
                      </td>
                      <td>
                        {stockBajo ? (
                          <span className="badge danger">
                            ⚠ Stock bajo
                          </span>
                        ) : (
                          <span className="badge success">
                            Disponible
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

function App() {
  const [usuario, setUsuario] = useState(null)

  const cerrarSesion = () => {
    setUsuario(null)
  }

  if (!usuario) {
    return <Login onLogin={setUsuario} />
  }

  return (
    <Dashboard
      usuario={usuario}
      onLogout={cerrarSesion}
    />
  )
}

createRoot(document.getElementById('root')).render(
  <App />
)
