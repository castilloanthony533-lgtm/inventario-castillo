import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  Search,
  ScanLine,
  ArrowDownToLine,
  ArrowUpFromLine,
  Save,
  Camera,
  UserPlus
} from 'lucide-react'
import './index.css'

/* =====================================================
   USUARIOS
===================================================== */

const USUARIOS_INICIALES = [
  {
    id: 1,
    usuario: 'admin',
    password: 'Admin123',
    nombre: 'Administrador',
    rol: 'Administrador'
  },
  {
    id: 2,
    usuario: 'vendedor1',
    password: 'Venta123',
    nombre: 'Vendedor 1',
    rol: 'Vendedor'
  },
  {
    id: 3,
    usuario: 'vendedor2',
    password: 'Venta456',
    nombre: 'Vendedor 2',
    rol: 'Vendedor'
  },
  {
    id: 4,
    usuario: 'bodega',
    password: 'Bodega123',
    nombre: 'Bodega',
    rol: 'Bodega'
  }
]

/* =====================================================
   PRODUCTOS INICIALES
===================================================== */

const PRODUCTOS_INICIALES = [
  {
    id: 1,
    codigo: 'CAST-001',
    producto: 'Filtro de aceite Toyota',
    categoria: 'Filtros',
    marca: 'Toyota',
    anio: '2020-2026',
    stock: 15,
    minimo: 10,
    proveedor: 'Proveedor Toyota',
    precioCompra: 150,
    precioVenta: 250
  },
  {
    id: 2,
    codigo: 'CAST-002',
    producto: 'Foco H7 LED',
    categoria: 'Iluminación',
    marca: 'Universal',
    anio: '2020-2026',
    stock: 5,
    minimo: 8,
    proveedor: 'Proveedor LED',
    precioCompra: 500,
    precioVenta: 850
  },
  {
    id: 3,
    codigo: 'CAST-003',
    producto: 'Banda Toyota',
    categoria: 'Motor',
    marca: 'Toyota',
    anio: '2018-2026',
    stock: 20,
    minimo: 5,
    proveedor: 'Proveedor Motor',
    precioCompra: 300,
    precioVenta: 450
  },
  {
    id: 4,
    codigo: 'CAST-004',
    producto: 'Stop Isuzu D-Max',
    categoria: 'Iluminación',
    marca: 'Isuzu',
    anio: '2019-2026',
    stock: 7,
    minimo: 5,
    proveedor: 'Proveedor Isuzu',
    precioCompra: 800,
    precioVenta: 1200
  }
]

/* =====================================================
   UTILIDADES
===================================================== */

const cargarDatos = (clave, valorInicial) => {
  try {
    const guardado = localStorage.getItem(clave)

    if (guardado) {
      return JSON.parse(guardado)
    }
  } catch (error) {
    console.error(error)
  }

  return valorInicial
}

const guardarDatos = (clave, datos) => {
  try {
    localStorage.setItem(
      clave,
      JSON.stringify(datos)
    )
  } catch (error) {
    console.error(error)
  }
}

/* =====================================================
   LOGIN
===================================================== */

function Login({ usuarios, onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] =
    useState(false)
  const [error, setError] = useState('')

  const iniciarSesion = (e) => {
    e.preventDefault()

    const encontrado = usuarios.find(
      (u) =>
        u.usuario === usuario.trim() &&
        u.password === password
    )

    if (!encontrado) {
      setError(
        'Usuario o contraseña incorrectos'
      )
      return
    }

    setError('')
    onLogin(encontrado)
  }

  return (
    <div className="login-page">
      <div className="login-background">

        <div className="login-card">

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

/* =====================================================
   DASHBOARD
===================================================== */

function DashboardHome({ productos }) {

  const valorInventario =
    productos.reduce(
      (total, producto) =>
        total +
        Number(producto.stock) *
          Number(producto.precioCompra),
      0
    )

  const valorVenta =
    productos.reduce(
      (total, producto) =>
        total +
        Number(producto.stock) *
          Number(producto.precioVenta),
      0
    )

  const stockBajo =
    productos.filter(
      (producto) =>
        Number(producto.stock) <=
        Number(producto.minimo)
    )

  const totalUnidades =
    productos.reduce(
      (total, producto) =>
        total + Number(producto.stock),
      0
    )

  return (
    <>
      <div className="welcome">

        <div>
          <h2>
            Dashboard
          </h2>

          <p>
            Resumen general del inventario.
          </p>
        </div>

      </div>

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
              L {valorInventario.toLocaleString()}
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
              L {valorVenta.toLocaleString()}
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

      {stockBajo.length > 0 && (

        <div className="stock-alert">

          <AlertTriangle size={22} />

          <div>

            <strong>
              Atención: stock bajo
            </strong>

            <p>
              Hay {stockBajo.length} producto(s)
              por debajo del stock mínimo.
            </p>

          </div>

        </div>

      )}

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
                <th>Código</th>
                <th>Producto</th>
                <th>Marca</th>
                <th>Año</th>
                <th>Stock</th>
                <th>Venta</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>

              {productos.map((producto) => {

                const stock =
                  Number(producto.stock)

                const minimo =
                  Number(producto.minimo)

                return (
                  <tr key={producto.id}>

                    <td>
                      {producto.codigo}
                    </td>

                    <td>
                      <strong>
                        {producto.producto}
                      </strong>
                    </td>

                    <td>
                      {producto.marca}
                    </td>

                    <td>
                      {producto.anio}
                    </td>

                    <td>
                      {stock}
                    </td>

                    <td>
                      L {Number(
                        producto.precioVenta
                      ).toLocaleString()}
                    </td>

                    <td>

                      {stock === 0 ? (

                        <span className="badge danger">
                          No disponible
                        </span>

                      ) : stock <= minimo ? (

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
              })}

            </tbody>

          </table>

        </div>

      </section>
    </>
  )
}

/* =====================================================
   PRODUCTOS
===================================================== */

function Productos({
  productos,
  setProductos
}) {

  const formularioInicial = {
    id: null,
    codigo: '',
    producto: '',
    categoria: '',
    marca: '',
    anio: '',
    stock: 0,
    minimo: 1,
    proveedor: '',
    precioCompra: 0,
    precioVenta: 0
  }

  const [formulario, setFormulario] =
    useState(formularioInicial)

  const [editando, setEditando] =
    useState(false)

  const [busqueda, setBusqueda] =
    useState('')

  const [mostrarForm, setMostrarForm] =
    useState(false)

  const productosFiltrados =
    productos.filter((producto) => {

      const texto =
        busqueda.toLowerCase()

      return (
        producto.producto
          .toLowerCase()
          .includes(texto) ||
        producto.codigo
          .toLowerCase()
          .includes(texto) ||
        producto.marca
          .toLowerCase()
          .includes(texto)
      )
    })

  const cambiarCampo = (campo, valor) => {

    setFormulario({
      ...formulario,
      [campo]: valor
    })
  }

  const guardarProducto = (e) => {

    e.preventDefault()

    if (
      !formulario.codigo ||
      !formulario.producto
    ) {
      alert(
        'Ingresa como mínimo el código y nombre del producto.'
      )
      return
    }

    if (editando) {

      setProductos(
        productos.map((producto) =>
          producto.id === formulario.id
            ? {
                ...formulario,
                stock: Number(
                  formulario.stock
                ),
                minimo: Number(
                  formulario.minimo
                ),
                precioCompra: Number(
                  formulario.precioCompra
                ),
                precioVenta: Number(
                  formulario.precioVenta
                )
              }
            : producto
        )
      )

    } else {

      const nuevo = {
        ...formulario,
        id: Date.now(),
        stock: Number(formulario.stock),
        minimo: Number(formulario.minimo),
        precioCompra: Number(
          formulario.precioCompra
        ),
        precioVenta: Number(
          formulario.precioVenta
        )
      }

      setProductos([
        ...productos,
        nuevo
      ])
    }

    setFormulario(
      formularioInicial
    )

    setEditando(false)
    setMostrarForm(false)
  }

  const editarProducto = (producto) => {

    setFormulario(producto)
    setEditando(true)
    setMostrarForm(true)
  }

  const eliminarProducto = (id) => {

    if (
      !confirm(
        '¿Seguro que quieres eliminar este producto?'
      )
    ) {
      return
    }

    setProductos(
      productos.filter(
        (producto) =>
          producto.id !== id
      )
    )
  }

  return (
    <>
      <div className="welcome">

        <div>
          <h2>
            Productos
          </h2>

          <p>
            Administra tus repuestos.
          </p>
        </div>

        <button
          className="login-button"
          style={{
            width: 'auto',
            padding: '0 18px'
          }}
          onClick={() => {
            setFormulario(
              formularioInicial
            )
            setEditando(false)
            setMostrarForm(true)
          }}
        >
          <Plus size={17} />
          Nuevo producto
        </button>

      </div>

      <section className="panel">

        <div
          className="panel-header"
          style={{
            gap: 15,
            flexWrap: 'wrap'
          }}
        >

          <div>
            <h3>
              Lista de productos
            </h3>

            <p>
              {productos.length} productos registrados
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '8px 12px',
              background: '#f8fafc'
            }}
          >
            <Search size={17} />

            <input
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              placeholder="Buscar..."
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent'
              }}
            />

          </div>

        </div>

        {mostrarForm && (

          <form
            onSubmit={guardarProducto}
            style={{
              padding: 20,
              background: '#f8fafc',
              borderBottom:
                '1px solid #e2e8f0'
            }}
          >

            <h3>
              {editando
                ? 'Editar producto'
                : 'Nuevo producto'}
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit,minmax(180px,1fr))',
                gap: 12,
                marginTop: 15
              }}
            >

              <input
                placeholder="Código"
                value={formulario.codigo}
                onChange={(e) =>
                  cambiarCampo(
                    'codigo',
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Producto"
                value={formulario.producto}
                onChange={(e) =>
                  cambiarCampo(
                    'producto',
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Categoría"
                value={formulario.categoria}
                onChange={(e) =>
                  cambiarCampo(
                    'categoria',
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Marca"
                value={formulario.marca}
                onChange={(e) =>
                  cambiarCampo(
                    'marca',
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Año"
                value={formulario.anio}
                onChange={(e) =>
                  cambiarCampo(
                    'anio',
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Proveedor"
                value={formulario.proveedor}
                onChange={(e) =>
                  cambiarCampo(
                    'proveedor',
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Cantidad"
                value={formulario.stock}
                onChange={(e) =>
                  cambiarCampo(
                    'stock',
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Stock mínimo"
                value={formulario.minimo}
                onChange={(e) =>
                  cambiarCampo(
                    'minimo',
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Precio compra"
                value={formulario.precioCompra}
                onChange={(e) =>
                  cambiarCampo(
                    'precioCompra',
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Precio venta"
                value={formulario.precioVenta}
                onChange={(e) =>
                  cambiarCampo(
                    'precioVenta',
                    e.target.value
                  )
                }
              />

            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 15
              }}
            >

              <button
                type="submit"
                className="login-button"
                style={{
                  width: 'auto',
                  padding: '0 20px'
                }}
              >
                <Save size={17} />
                Guardar
              </button>

              <button
                type="button"
                onClick={() => {
                  setMostrarForm(false)
                  setEditando(false)
                }}
                style={{
                  padding: '10px 18px',
                  border: '1px solid #cbd5e1',
                  borderRadius: 10,
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>

            </div>

          </form>

        )}

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Marca</th>
                <th>Año</th>
                <th>Stock</th>
                <th>Compra</th>
                <th>Venta</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {productosFiltrados.map(
                (producto) => {

                  const stock =
                    Number(producto.stock)

                  const minimo =
                    Number(producto.minimo)

                  return (
                    <tr
                      key={producto.id}
                    >

                      <td>
                        {producto.codigo}
                      </td>

                      <td>
                        <strong>
                          {producto.producto}
                        </strong>
                      </td>

                      <td>
                        {producto.marca}
                      </td>

                      <td>
                        {producto.anio}
                      </td>

                      <td>
                        {stock}
                      </td>

                      <td>
                        L {Number(
                          producto.precioCompra
                        ).toLocaleString()}
                      </td>

                      <td>
                        L {Number(
                          producto.precioVenta
                        ).toLocaleString()}
                      </td>

                      <td>

                        {stock === 0 ? (
                          <span className="badge danger">
                            No disponible
                          </span>
                        ) : stock <= minimo ? (
                          <span className="badge danger">
                            Stock bajo
                          </span>
                        ) : (
                          <span className="badge success">
                            Disponible
                          </span>
                        )}

                      </td>

                      <td>

                        <button
                          onClick={() =>
                            editarProducto(
                              producto
                            )
                          }
                          style={{
                            border: 'none',
                            background: '#eff6ff',
                            color: '#2563eb',
                            padding: 8,
                            borderRadius: 8,
                            cursor: 'pointer',
                            marginRight: 5
                          }}
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={() =>
                            eliminarProducto(
                              producto.id
                            )
                          }
                          style={{
                            border: 'none',
                            background: '#fef2f2',
                            color: '#dc2626',
                            padding: 8,
                            borderRadius: 8,
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>

                      </td>

                    </tr>
                  )
                }
              )}

            </tbody>

          </table>

        </div>

      </section>
    </>
  )
}

/* =====================================================
   INVENTARIO
===================================================== */

function Inventario({
  productos,
  setProductos
}) {

  const [codigo, setCodigo] =
    useState('')

  const [cantidad, setCantidad] =
    useState(1)

  const [tipo, setTipo] =
    useState('entrada')

  const [historial, setHistorial] =
    useState(() =>
      cargarDatos(
        'castillo_movimientos',
        []
      )
    )

  const [mensaje, setMensaje] =
    useState('')

  const buscarProducto = () => {

    const encontrado =
      productos.find(
        (p) =>
          p.codigo.toLowerCase() ===
          codigo.trim().toLowerCase()
      )

    if (!encontrado) {
      setMensaje(
        'Producto no encontrado.'
      )
      return
    }

    const cantidadNumero =
      Number(cantidad)

    if (
      !cantidadNumero ||
      cantidadNumero < 1
    ) {
      setMensaje(
        'Ingresa una cantidad válida.'
      )
      return
    }

    if (
      tipo === 'salida' &&
      encontrado.stock < cantidadNumero
    ) {
      setMensaje(
        'No hay suficiente stock.'
      )
      return
    }

    const nuevoStock =
      tipo === 'entrada'
        ? encontrado.stock +
          cantidadNumero
        : encontrado.stock -
          cantidadNumero

    setProductos(
      productos.map((producto) =>
        producto.id === encontrado.id
          ? {
              ...producto,
              stock: nuevoStock
            }
          : producto
      )
    )

    const movimiento = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      codigo: encontrado.codigo,
      producto: encontrado.producto,
      tipo,
      cantidad: cantidadNumero
    }

    const nuevoHistorial = [
      movimiento,
      ...historial
    ]

    setHistorial(nuevoHistorial)

    guardarDatos(
      'castillo_movimientos',
      nuevoHistorial
    )

    setMensaje(
      tipo === 'entrada'
        ? 'Entrada registrada correctamente.'
        : 'Salida registrada correctamente.'
    )

    setCodigo('')
    setCantidad(1)
  }

  return (
    <>
      <div className="welcome">

        <div>
          <h2>
            Inventario
          </h2>

          <p>
            Registra entradas y salidas.
          </p>
        </div>

      </div>

      <section className="panel">

        <div className="panel-header">

          <div>
            <h3>
              Movimiento de inventario
            </h3>

            <p>
              Actualiza las existencias.
            </p>
          </div>

        </div>

        <div
          style={{
            padding: 22,
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(180px,1fr))',
            gap: 15
          }}
        >

          <div>
            <label>
              Código del producto
            </label>

            <input
              value={codigo}
              onChange={(e) =>
                setCodigo(e.target.value)
              }
              placeholder="Ej: CAST-001"
              style={{
                width: '100%',
                padding: 12,
                marginTop: 6,
                border: '1px solid #cbd5e1',
                borderRadius: 10
              }}
            />
          </div>

          <div>
            <label>
              Tipo
            </label>

            <select
              value={tipo}
              onChange={(e) =>
                setTipo(e.target.value)
              }
              style={{
                width: '100%',
                padding: 12,
                marginTop: 6,
                border: '1px solid #cbd5e1',
                borderRadius: 10
              }}
            >
              <option value="entrada">
                Entrada
              </option>

              <option value="salida">
                Salida
              </option>
            </select>
          </div>

          <div>
            <label>
              Cantidad
            </label>

            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) =>
                setCantidad(
                  e.target.value
                )
              }
              style={{
                width: '100%',
                padding: 12,
                marginTop: 6,
                border: '1px solid #cbd5e1',
                borderRadius: 10
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'end'
            }}
          >

            <button
              className="login-button"
              style={{
                width: '100%'
              }}
              onClick={buscarProducto}
            >
              {tipo === 'entrada' ? (
                <ArrowDownToLine size={17} />
              ) : (
                <ArrowUpFromLine size={17} />
              )}

              Registrar
            </button>

          </div>

        </div>

        {mensaje && (
          <div
            style={{
              margin: '0 22px 20px',
              padding: 12,
              borderRadius: 10,
              background: '#eff6ff',
              color: '#1d4ed8',
              fontWeight: 700
            }}
          >
            {mensaje}
          </div>
        )}

      </section>

      <section
        className="panel"
        style={{ marginTop: 20 }}
      >

        <div className="panel-header">

          <div>
            <h3>
              Historial de movimientos
            </h3>

            <p>
              Últimas entradas y salidas
            </p>
          </div>

        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Fecha</th>
                <th>Código</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
              </tr>
            </thead>

            <tbody>

              {historial.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: 'center'
                    }}
                  >
                    No hay movimientos.
                  </td>
                </tr>

              ) : (

                historial.map(
                  (movimiento) => (

                    <tr
                      key={movimiento.id}
                    >

                      <td>
                        {movimiento.fecha}
                      </td>

                      <td>
                        {movimiento.codigo}
                      </td>

                      <td>
                        {movimiento.producto}
                      </td>

                      <td>

                        {movimiento.tipo ===
                        'entrada' ? (

                          <span className="badge success">
                            Entrada
                          </span>

                        ) : (

                          <span className="badge danger">
                            Salida
                          </span>

                        )}

                      </td>

                      <td>
                        {movimiento.cantidad}
                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </section>
    </>
  )
}

/* =====================================================
   USUARIOS
===================================================== */

function Usuarios({
  usuarios,
  setUsuarios,
  usuarioActual
}) {

  const [mostrarForm, setMostrarForm] =
    useState(false)

  const [editando, setEditando] =
    useState(null)

  const [form, setForm] = useState({
    usuario: '',
    password: '',
    nombre: '',
    rol: 'Vendedor'
  })

  const guardarUsuario = (e) => {

    e.preventDefault()

    if (
      !form.usuario ||
      !form.password ||
      !form.nombre
    ) {
      alert(
        'Completa todos los campos.'
      )
      return
    }

    if (editando) {

      setUsuarios(
        usuarios.map((u) =>
          u.id === editando
            ? {
                ...u,
                ...form
              }
            : u
        )
      )

    } else {

      const existe =
        usuarios.some(
          (u) =>
            u.usuario ===
            form.usuario
        )

      if (existe) {
        alert(
          'Ese usuario ya existe.'
        )
        return
      }

      setUsuarios([
        ...usuarios,
        {
          id: Date.now(),
          ...form
        }
      ])
    }

    setForm({
      usuario: '',
      password: '',
      nombre: '',
      rol: 'Vendedor'
    })

    setEditando(null)
    setMostrarForm(false)
  }

  const editarUsuario = (u) => {

    setForm({
      usuario: u.usuario,
      password: u.password,
      nombre: u.nombre,
      rol: u.rol
    })

    setEditando(u.id)
    setMostrarForm(true)
  }

  const eliminarUsuario = (id) => {

    if (id === usuarioActual.id) {
      alert(
        'No puedes eliminar el usuario con el que estás conectado.'
      )
      return
    }

    if (
      !confirm(
        '¿Eliminar este usuario?'
      )
    ) {
      return
    }

    setUsuarios(
      usuarios.filter(
        (u) => u.id !== id
      )
    )
  }

  return (
    <>
      <div className="welcome">

        <div>
          <h2>
            Usuarios
          </h2>

          <p>
            Administra los usuarios del sistema.
          </p>
        </div>

        <button
          className="login-button"
          style={{
            width: 'auto',
            padding: '0 18px'
          }}
          onClick={() => {
            setForm({
              usuario: '',
              password: '',
              nombre: '',
              rol: 'Vendedor'
            })
            setEditando(null)
            setMostrarForm(true)
          }}
        >
          <UserPlus size={17} />
          Nuevo usuario
        </button>

      </div>

      <section className="panel">

        <div className="panel-header">

          <div>
            <h3>
              Usuarios registrados
            </h3>

            <p>
              {usuarios.length} usuarios
            </p>
          </div>

        </div>

        {mostrarForm && (

          <form
            onSubmit={guardarUsuario}
            style={{
              padding: 20,
              background: '#f8fafc',
              borderBottom:
                '1px solid #e2e8f0'
            }}
          >

            <h3>
              {editando
                ? 'Editar usuario'
                : 'Nuevo usuario'}
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit,minmax(180px,1fr))',
                gap: 12,
                marginTop: 15
              }}
            >

              <input
                placeholder="Usuario"
                value={form.usuario}
                onChange={(e) =>
                  setForm({
                    ...form,
                    usuario:
                      e.target.value
                  })
                }
              />

              <input
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password:
                      e.target.value
                  })
                }
              />

              <input
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nombre:
                      e.target.value
                  })
                }
              />

              <select
                value={form.rol}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rol: e.target.value
                  })
                }
              >
                <option>
                  Administrador
                </option>

                <option>
                  Vendedor
                </option>

                <option>
                  Bodega
                </option>
              </select>

            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 15
              }}
            >

              <button
                type="submit"
                className="login-button"
                style={{
                  width: 'auto',
                  padding: '0 20px'
                }}
              >
                <Save size={17} />
                Guardar
              </button>

              <button
                type="button"
                onClick={() =>
                  setMostrarForm(false)
                }
                style={{
                  padding: '10px 18px',
                  border: '1px solid #cbd5e1',
                  borderRadius: 10,
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>

            </div>

          </form>

        )}

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {usuarios.map((u) => (

                <tr key={u.id}>

                  <td>
                    {u.usuario}
                  </td>

                  <td>
                    {u.nombre}
                  </td>

                  <td>
                    {u.rol}
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        editarUsuario(u)
                      }
                      style={{
                        border: 'none',
                        background: '#eff6ff',
                        color: '#2563eb',
                        padding: 8,
                        borderRadius: 8,
                        cursor: 'pointer',
                        marginRight: 5
                      }}
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      onClick={() =>
                        eliminarUsuario(u.id)
                      }
                      style={{
                        border: 'none',
                        background: '#fef2f2',
                        color: '#dc2626',
                        padding: 8,
                        borderRadius: 8,
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>
    </>
  )
}

/* =====================================================
   ESCÁNER
===================================================== */

function Escaner({ productos }) {

  const videoRef = useRef(null)

  const streamRef = useRef(null)

  const detectorRef = useRef(null)

  const [activo, setActivo] =
    useState(false)

  const [codigo, setCodigo] =
    useState('')

  const [resultado, setResultado] =
    useState(null)

  const [mensaje, setMensaje] =
    useState('')

  const buscarCodigo = (valor) => {

    const encontrado =
      productos.find(
        (p) =>
          p.codigo.toLowerCase() ===
          valor.toLowerCase()
      )

    if (encontrado) {

      setResultado(encontrado)

      setMensaje(
        'Producto encontrado.'
      )

    } else {

      setResultado(null)

      setMensaje(
        'No existe un producto con ese código.'
      )

    }
  }

  const iniciarCamara = async () => {

    try {

      if (
        !('BarcodeDetector' in window)
      ) {
        setMensaje(
          'Tu navegador no permite el escaneo automático. Puedes escribir el código manualmente.'
        )
        return
      }

      const detector =
        new window.BarcodeDetector({
          formats: [
            'code_128',
            'code_39',
            'ean_13',
            'ean_8',
            'upc_a',
            'upc_e'
          ]
        })

      detectorRef.current =
        detector

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: {
                ideal: 'environment'
              }
            },
            audio: false
          }
        )

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream

        await videoRef.current.play()
      }

      setActivo(true)

      detectar()
    } catch (error) {

      console.error(error)

      setMensaje(
        'No se pudo abrir la cámara. Revisa el permiso de cámara del navegador.'
      )
    }
  }

  const detectar = async () => {

    if (
      !videoRef.current ||
      !detectorRef.current ||
      !activo
    ) {
      return
    }

    try {

      const codigos =
        await detectorRef.current.detect(
          videoRef.current
        )

      if (
        codigos &&
        codigos.length > 0
      ) {

        const valor =
          codigos[0].rawValue

        setCodigo(valor)

        buscarCodigo(valor)

        detenerCamara()

        return
      }

    } catch (error) {
      console.error(error)
    }

    requestAnimationFrame(
      detectar
    )
  }

  const detenerCamara = () => {

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        )

      streamRef.current = null
    }

    setActivo(false)
  }

  useEffect(() => {

    return () => {
      detenerCamara()
    }

  }, [])

  return (
    <>
      <div className="welcome">

        <div>
          <h2>
            Escáner
          </h2>

          <p>
            Escanea el código de barras de un repuesto.
          </p>
        </div>

      </div>

      <section className="panel">

        <div className="panel-header">

          <div>
            <h3>
              Escáner de códigos
            </h3>

            <p>
              Usa la cámara trasera del iPhone.
            </p>
          </div>

          <ScanLine size={24} />

        </div>

        <div
          style={{
            padding: 22
          }}
        >

          {!activo && (

            <button
              className="login-button"
              style={{
                width: 'auto',
                padding: '0 20px'
              }}
              onClick={iniciarCamara}
            >
              <Camera size={18} />
              Abrir cámara
            </button>

          )}

          {activo && (

            <button
              onClick={detenerCamara}
              style={{
                padding: '12px 18px',
                border: 'none',
                borderRadius: 10,
                background: '#dc2626',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cerrar cámara
            </button>

          )}

          <div
            style={{
              marginTop: 18,
              maxWidth: 500,
              borderRadius: 15,
              overflow: 'hidden',
              background: '#020617'
            }}
          >

            <video
              ref={videoRef}
              muted
              playsInline
              style={{
                width: '100%',
                display:
                  activo
                    ? 'block'
                    : 'none'
              }}
            />

            {!activo && (
              <div
                style={{
                  padding: 40,
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                <ScanLine
                  size={45}
                />

                <p>
                  Cámara apagada
                </p>
              </div>
            )}

          </div>

          <div
            style={{
              marginTop: 20,
              display: 'flex',
              gap: 10,
              maxWidth: 500
            }}
          >

            <input
              value={codigo}
              onChange={(e) =>
                setCodigo(e.target.value)
              }
              placeholder="Escribe o escanea un código"
              style={{
                flex: 1,
                padding: 12,
                border:
                  '1px solid #cbd5e1',
                borderRadius: 10
              }}
            />

            <button
              onClick={() =>
                buscarCodigo(codigo)
              }
              style={{
                padding: '0 15px',
                border: 'none',
                borderRadius: 10,
                background: '#2563eb',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Buscar
            </button>

          </div>

          {mensaje && (
            <p
              style={{
                marginTop: 15,
                fontWeight: 700
              }}
            >
              {mensaje}
            </p>
          )}

          {resultado && (

            <div
              className="panel"
              style={{
                marginTop: 20,
                padding: 20,
                maxWidth: 500
              }}
            >

              <h3>
                Producto encontrado
              </h3>

              <p>
                <strong>
                  Código:
                </strong>{' '}
                {resultado.codigo}
              </p>

              <p>
                <strong>
                  Producto:
                </strong>{' '}
                {resultado.producto}
              </p>

              <p>
                <strong>
                  Marca:
                </strong>{' '}
                {resultado.marca}
              </p>

              <p>
                <strong>
                  Año:
                </strong>{' '}
                {resultado.anio}
              </p>

              <p>
                <strong>
                  Stock:
                </strong>{' '}
                {resultado.stock}
              </p>

              <p>
                <strong>
                  Precio:
                </strong>{' '}
                L {Number(
                  resultado.precioVenta
                ).toLocaleString()}
              </p>

            </div>

          )}

        </div>

      </section>
    </>
  )
}

/* =====================================================
   DASHBOARD PRINCIPAL
===================================================== */

function Dashboard({
  usuario,
  usuarios,
  setUsuarios,
  onLogout
}) {

  const [menuAbierto, setMenuAbierto] =
    useState(false)

  const [seccion, setSeccion] =
    useState('dashboard')

  const [productos, setProductos] =
    useState(() =>
      cargarDatos(
        'castillo_productos',
        PRODUCTOS_INICIALES
      )
    )

  useEffect(() => {
    guardarDatos(
      'castillo_productos',
      productos
    )
  }, [productos])

  useEffect(() => {
    guardarDatos(
      'castillo_usuarios',
      usuarios
    )
  }, [usuarios])

  const cambiarSeccion = (nueva) => {

    setSeccion(nueva)
    setMenuAbierto(false)
  }

  let contenido = null

  if (seccion === 'dashboard') {

    contenido = (
      <DashboardHome
        productos={productos}
      />
    )

  } else if (seccion === 'productos') {

    contenido = (
      <Productos
        productos={productos}
        setProductos={setProductos}
      />
    )

  } else if (seccion === 'inventario') {

    contenido = (
      <Inventario
        productos={productos}
        setProductos={setProductos}
      />
    )

  } else if (seccion === 'usuarios') {

    contenido = (
      <Usuarios
        usuarios={usuarios}
        setUsuarios={setUsuarios}
        usuarioActual={usuario}
      />
    )

  } else if (seccion === 'escaner') {

    contenido = (
      <Escaner
        productos={productos}
      />
    )
  }

  return (
    <div className="app">

      {/* TOPBAR */}

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

      {/* SIDEBAR */}

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

        <button
          className={
            seccion === 'dashboard'
              ? 'active'
              : ''
          }
          onClick={() =>
            cambiarSeccion(
              'dashboard'
            )
          }
        >
          <LayoutDashboard size={19} />
          Dashboard
        </button>

        <button
          className={
            seccion === 'productos'
              ? 'active'
              : ''
          }
          onClick={() =>
            cambiarSeccion(
              'productos'
            )
          }
        >
          <Package size={19} />
          Productos
        </button>

        <button
          className={
            seccion === 'inventario'
              ? 'active'
              : ''
          }
          onClick={() =>
            cambiarSeccion(
              'inventario'
            )
          }
        >
          <Boxes size={19} />
          Inventario
        </button>

        <button
          className={
            seccion === 'escaner'
              ? 'active'
              : ''
          }
          onClick={() =>
            cambiarSeccion(
              'escaner'
            )
          }
        >
          <ScanLine size={19} />
          Escáner
        </button>

        <button
          className={
            seccion === 'usuarios'
              ? 'active'
              : ''
          }
          onClick={() =>
            cambiarSeccion(
              'usuarios'
            )
          }
        >
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

      {/* CONTENIDO */}

      <main className="content">
        {contenido}
      </main>

    </div>
  )
}

/* =====================================================
   APP
===================================================== */

function App() {

  const [usuario, setUsuario] =
    useState(null)

  const [usuarios, setUsuarios] =
    useState(() =>
      cargarDatos(
        'castillo_usuarios',
        USUARIOS_INICIALES
      )
    )

  const cerrarSesion = () => {
    setUsuario(null)
  }

  if (!usuario) {

    return (
      <Login
        usuarios={usuarios}
        onLogin={setUsuario}
      />
    )
  }

  return (
    <Dashboard
      usuario={usuario}
      usuarios={usuarios}
      setUsuarios={setUsuarios}
      onLogout={cerrarSesion}
    />
  )
}

/* =====================================================
   INICIAR
===================================================== */

createRoot(
  document.getElementById('root')
).render(
  <App />
)
