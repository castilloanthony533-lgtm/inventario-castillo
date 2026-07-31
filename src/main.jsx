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
  DollarSign,
  Boxes,
  TrendingUp
} from 'lucide-react'
import './index.css'

/* =========================================
   USUARIOS
========================================= */

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

/* =========================================
   LOGIN
========================================= */

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
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
      <div className="login-background">

        <div className="login-card">

          {/* LOGO / EMPRESA */}

          <div className="login-brand">

            <div className="login-logo">
              ⚡
            </div>

            <h1>
              CASTILLO ELECTRIPARTES
            </h1>

            <p>
              SISTEMA DE INVENTARIO
            </p>

            <div className="login-line"></div>

          </div>

          {/* FORMULARIO */}

          <form onSubmit={iniciarSesion}>

            <div className="input-group">

              <label>
                Usuario
              </label>

              <div className="input-wrapper">

                <span>
                  👤
                </span>

                <input
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={usuario}
                  onChange={(e) => {
                    setUsuario(e.target.value)
                    setError('')
                  }}
                  autoComplete="username"
                />

              </div>

            </div>

            <div className="input-group">

              <label>
                Contraseña
              </label>

              <div className="input-wrapper">

                <span>
                  🔒
                </span>

                <input
                  type={
                    mostrarPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setMostrarPassword(
                      !mostrarPassword
                    )
                  }
                >
                  {mostrarPassword
                    ? 'Ocultar'
                    : 'Ver'}
                </button>

              </div>

            </div>

            {error && (
              <div className="login-error">
                <AlertTriangle size={17} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="login-button"
            >
              INICIAR SESIÓN
            </button>

          </form>

          <div className="login-footer">
            <span>
              Castillo Electripartes
            </span>

            <span>•</span>

            <span>
              Inventario
            </span>
          </div>

        </div>

      </div>
    </div>
  )
}

/* =========================================
   PRODUCTOS DE EJEMPLO
========================================= */

const PRODUCTOS_INICIALES = [
  {
    id: 1,
    producto: 'Filtro de aceite Toyota',
    categoria: 'Filtros',
    stock: 15,
    minimo: 10,
    proveedor: 'Proveedor Toyota',
    precioCompra: 150,
    precioVenta: 250
  },
  {
    id: 2,
    producto: 'Foco H7 LED',
    categoria: 'Iluminación',
    stock: 5,
    minimo: 8,
    proveedor: 'Proveedor LED',
    precioCompra: 500,
    precioVenta: 850
  },
  {
    id: 3,
    producto: 'Banda Toyota',
    categoria: 'Motor',
    stock: 20,
    minimo: 5,
    proveedor: 'Proveedor Motor',
    precioCompra: 300,
    precioVenta: 450
  },
  {
    id: 4,
    producto: 'Stop Isuzu D-Max',
    categoria: 'Iluminación',
    stock: 7,
    minimo: 5,
    proveedor: 'Proveedor Isuzu',
    precioCompra: 800,
    precioVenta: 1200
  }
]

/* =========================================
   DASHBOARD
========================================= */

function Dashboard({ usuario, onLogout }) {

  const [menuAbierto, setMenuAbierto] =
    useState(false)

  const [productos] = useState(
    PRODUCTOS_INICIALES
  )

  const valorInventario =
    productos.reduce(
      (total, producto) =>
        total +
        producto.stock *
          producto.precioCompra,
      0
    )

  const valorVenta =
    productos.reduce(
      (total, producto) =>
        total +
        producto.stock *
          producto.precioVenta,
      0
    )

  const stockBajo =
    productos.filter(
      (producto) =>
        producto.stock <=
        producto.minimo
    )

  const totalUnidades =
    productos.reduce(
      (total, producto) =>
        total + producto.stock,
      0
    )

  return (
    <div className="app">

      {/* =================================
          BARRA SUPERIOR
      ================================= */}

      <header className="topbar">

        <button
          className="menu-button"
          onClick={() =>
            setMenuAbierto(
              !menuAbierto
            )
          }
        >
          {menuAbierto ? (
            <X />
          ) : (
            <Menu />
          )}
        </button>

        <div className="brand">

          <div className="brand-logo">
            ⚡
          </div>

          <div>
            <strong>
              CASTILLO ELECTRIPARTES
            </strong>

            <small>
              Inventario
            </small>
          </div>

        </div>

        <div className="user-info">

          <div className="user-text">

            <strong>
              {usuario.nombre}
            </strong>

            <span>
              {usuario.rol}
            </span>

          </div>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            <LogOut size={19} />

            <span>
              Cerrar sesión
            </span>
          </button>

        </div>

      </header>

      {/* =================================
          MENÚ
      ================================= */}

      <aside
        className={
          menuAbierto
            ? 'sidebar open'
            : 'sidebar'
        }
      >

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            ⚡
          </div>

          <div>
            <strong>
              CASTILLO
            </strong>

            <span>
              ELECTRIPARTES
            </span>
          </div>

        </div>

        <button className="active">
          <LayoutDashboard size={19} />
          Dashboard
        </button>

        <button>
          <Package size={19} />
          Productos
        </button>

        <button>
          <Boxes size={19} />
          Inventario
        </button>

        <button>
          <Users size={19} />
          Usuarios
        </button>

        <button
          className="sidebar-logout"
          onClick={onLogout}
        >
          <LogOut size={19} />
          Cerrar sesión
        </button>

      </aside>

      {/* =================================
          CONTENIDO
      ================================= */}

      <main className="content">

        <div className="welcome">

          <div>
            <h2>
              Dashboard
            </h2>

            <p>
              Bienvenido, {usuario.nombre}.
            </p>
          </div>

          <div className="role-badge">
            {usuario.rol}
          </div>

        </div>

        {/* =================================
            KPI
        ================================= */}

        <div className="kpi-grid">

          <div className="kpi-card">

            <div className="kpi-icon">
              <Package />
            </div>

            <div>
              <span>
                Productos
              </span>

              <strong>
                {productos.length}
              </strong>
            </div>

          </div>

          <div className="kpi-card">

            <div className="kpi-icon">
              <Boxes />
            </div>

            <div>
              <span>
                Unidades
              </span>

              <strong>
                {totalUnidades}
              </strong>
            </div>

          </div>

          <div className="kpi-card">

            <div className="kpi-icon">
              <DollarSign />
            </div>

            <div>
              <span>
                Valor inventario
              </span>

              <strong>
                L{' '}
                {valorInventario.toLocaleString()}
              </strong>
            </div>

          </div>

          <div className="kpi-card">

            <div className="kpi-icon">
              <TrendingUp />
            </div>

            <div>
              <span>
                Valor venta
              </span>

              <strong>
                L{' '}
                {valorVenta.toLocaleString()}
              </strong>
            </div>

          </div>

          <div className="kpi-card warning">

            <div className="kpi-icon">
              <AlertTriangle />
            </div>

            <div>
              <span>
                Stock bajo
              </span>

              <strong>
                {stockBajo.length}
              </strong>
            </div>

          </div>

        </div>

        {/* =================================
            ALERTA
        ================================= */}

        {stockBajo.length > 0 && (

          <div className="stock-alert">

            <AlertTriangle size={22} />

            <div>

              <strong>
                Atención: stock bajo
              </strong>

              <p>
                Hay {stockBajo.length}{' '}
                producto(s) por debajo
                del stock mínimo.
              </p>

            </div>

          </div>

        )}

        {/* =================================
            TABLA
        ================================= */}

        <section className="panel">

          <div className="panel-header">

            <div>
              <h3>
                Inventario actual
              </h3>

              <p>
                Productos registrados
              </p>
            </div>

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
                  <th>Proveedor</th>
                  <th>Compra</th>
                  <th>Venta</th>
                  <th>Estado</th>
                </tr>

              </thead>

              <tbody>

                {productos.map(
                  (producto) => {

                    const bajo =
                      producto.stock <=
                      producto.minimo

                    return (

                      <tr
                        key={
                          producto.id
                        }
                      >

                        <td>
                          #{producto.id}
                        </td>

                        <td>
                          <strong>
                            {
                              producto.producto
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            producto.categoria
                          }
                        </td>

                        <td>
                          {
                            producto.stock
                          }
                        </td>

                        <td>
                          {
                            producto.minimo
                          }
                        </td>

                        <td>
                          {
                            producto.proveedor
                          }
                        </td>

                        <td>
                          L{' '}
                          {
                            producto
                              .precioCompra
                              .toLocaleString()
                          }
                        </td>

                        <td>
                          L{' '}
                          {
                            producto
                              .precioVenta
                              .toLocaleString()
                          }
                        </td>

                        <td>

                          {bajo ? (

                            <span className="badge danger">
                              ⚠ Stock bajo
                            </span>

                          ) : (

                            <span className="badge success">
                              ✓ Disponible
                            </span>

                          )}

                        </td>

                      </tr>

                    )
                  }
                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  )
}

/* =========================================
   APP PRINCIPAL
========================================= */

function App() {

  const [usuario, setUsuario] =
    useState(null)

  const cerrarSesion = () => {
    setUsuario(null)
  }

  if (!usuario) {

    return (
      <Login
        onLogin={setUsuario}
      />
    )
  }

  return (
    <Dashboard
      usuario={usuario}
      onLogout={cerrarSesion}
    />
  )
}

/* =========================================
   INICIAR APLICACIÓN
========================================= */

createRoot(
  document.getElementById('root')
).render(
  <App />
)
