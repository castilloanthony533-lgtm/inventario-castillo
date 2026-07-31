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
  Search,
  Trash2,
  Edit3,
  Save,
  ScanLine,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  Eye,
  EyeOff,
  XCircle
} from 'lucide-react'
import { supabase } from './supabase'
import './index.css'

/* =========================================================
   USUARIOS DEL LOGIN
========================================================= */

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

/* =========================================================
   PRODUCTOS DE EJEMPLO
========================================================= */

const PRODUCTOS_INICIALES = [
  {
    id: 1,
    codigo: '90915',
    producto: 'Filtro de aceite Toyota',
    categoria: 'Filtros',
    marca: 'Toyota',
    modelo: '',
    anio: '',
    stock: 15,
    minimo: 10,
    proveedor: 'Proveedor Toyota',
    precioCompra: 150,
    precioVenta: 250
  },
  {
    id: 2,
    codigo: 'H7-LED',
    producto: 'Foco H7 LED',
    categoria: 'Iluminación',
    marca: 'LED',
    modelo: '',
    anio: '',
    stock: 5,
    minimo: 8,
    proveedor: 'Proveedor LED',
    precioCompra: 500,
    precioVenta: 850
  },
  {
    id: 3,
    codigo: 'BANDA-001',
    producto: 'Banda Toyota',
    categoria: 'Motor',
    marca: 'Toyota',
    modelo: '',
    anio: '',
    stock: 20,
    minimo: 5,
    proveedor: 'Proveedor Motor',
    precioCompra: 300,
    precioVenta: 450
  }
]

/* =========================================================
   LOGIN
========================================================= */

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
    localStorage.setItem(
      'inventario_usuario',
      JSON.stringify(encontrado)
    )

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
              <label>Usuario</label>

              <div className="input-wrapper">
                <span>👤</span>

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
              <label>Contraseña</label>

              <div className="input-wrapper">
                <span>🔒</span>

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
                  {mostrarPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
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
            <span>Castillo Electripartes</span>
            <span>•</span>
            <span>Inventario</span>
          </div>

        </div>
      </div>
    </div>
  )
}

/* =========================================================
   FORMULARIO VACÍO
========================================================= */

const FORMULARIO_VACIO = {
  codigo: '',
  producto: '',
  categoria: '',
  marca: '',
  modelo: '',
  anio: '',
  proveedor: '',
  cantidad: 0,
  minimo: 0,
  precioCompra: 0,
  precioVenta: 0
}

/* =========================================================
   CONVERTIR PRODUCTO SUPABASE
========================================================= */

function convertirProducto(p) {
  return {
    id: p.id,
    codigo: p.codigo || '',
    producto: p.producto || '',
    categoria: p.categoria || '',
    marca: p.marca || '',
    modelo: p.modelo || '',
    anio: p.anio || '',
    proveedor: p.proveedor || '',
    stock: Number(p.cantidad || 0),
    minimo: Number(p.minimo || 0),
    precioCompra: Number(p.precio_compra || 0),
    precioVenta: Number(p.precio_venta || 0)
  }
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  usuario,
  onLogout,
  productos,
  cambiarSeccion,
  cargarProductos
}) {
  const valorInventario = productos.reduce(
    (total, producto) =>
      total +
      producto.stock *
        producto.precioCompra,
    0
  )

  const valorVenta = productos.reduce(
    (total, producto) =>
      total +
      producto.stock *
        producto.precioVenta,
    0
  )

  const stockBajo = productos.filter(
    (producto) =>
      producto.stock <= producto.minimo
  )

  const totalUnidades = productos.reduce(
    (total, producto) =>
      total + producto.stock,
    0
  )

  return (
    <>
      <div className="welcome">
        <div>
          <h2>Dashboard</h2>

          <p>
            Bienvenido, {usuario.nombre}.
          </p>
        </div>

        <div className="role-badge">
          {usuario.rol}
        </div>
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
            <Boxes />
          </div>

          <div>
            <span>Unidades</span>
            <strong>{totalUnidades}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <DollarSign />
          </div>

          <div>
            <span>Valor inventario</span>

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
            <span>Valor venta</span>

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
            <span>Stock bajo</span>
            <strong>{stockBajo.length}</strong>
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
              Hay {stockBajo.length}{' '}
              producto(s) por debajo
              del stock mínimo.
            </p>
          </div>
        </div>
      )}

      <section className="panel">

        <div className="panel-header">
          <div>
            <h3>Inventario actual</h3>

            <p>
              Productos registrados
            </p>
          </div>

          <button
            className="action-button"
            onClick={cargarProductos}
          >
            <RefreshCw size={17} />
            Actualizar
          </button>
        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Marca</th>
                <th>Stock</th>
                <th>Mínimo</th>
                <th>Compra</th>
                <th>Venta</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => {

                const bajo =
                  producto.stock <=
                  producto.minimo

                return (
                  <tr key={producto.id}>

                    <td>
                      <strong>
                        {producto.codigo}
                      </strong>
                    </td>

                    <td>
                      {producto.producto}
                    </td>

                    <td>
                      {producto.marca || '-'}
                    </td>

                    <td>
                      {producto.stock}
                    </td>

                    <td>
                      {producto.minimo}
                    </td>

                    <td>
                      L{' '}
                      {producto.precioCompra.toLocaleString()}
                    </td>

                    <td>
                      L{' '}
                      {producto.precioVenta.toLocaleString()}
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
              })}
            </tbody>

          </table>

        </div>
      </section>
    </>
  )
}

/* =========================================================
   PRODUCTOS
========================================================= */

function Productos({
  productos,
  cargarProductos,
  usuario
}) {
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [editando, setEditando] =
    useState(null)

  const [formulario, setFormulario] =
    useState(FORMULARIO_VACIO)

  const [mensaje, setMensaje] =
    useState('')

  const productosFiltrados =
    useMemo(() => {
      const texto =
        busqueda.toLowerCase().trim()

      if (!texto) return productos

      return productos.filter(
        (p) =>
          p.producto
            .toLowerCase()
            .includes(texto) ||
          p.codigo
            .toLowerCase()
            .includes(texto) ||
          p.marca
            .toLowerCase()
            .includes(texto) ||
          p.categoria
            .toLowerCase()
            .includes(texto)
      )
    }, [productos, busqueda])

  const abrirNuevo = () => {
    setEditando(null)
    setFormulario(FORMULARIO_VACIO)
    setMensaje('')
    setMostrarFormulario(true)
  }

  const abrirEditar = (producto) => {
    setEditando(producto)

    setFormulario({
      codigo: producto.codigo,
      producto: producto.producto,
      categoria: producto.categoria,
      marca: producto.marca,
      modelo: producto.modelo,
      anio: producto.anio,
      proveedor: producto.proveedor,
      cantidad: producto.stock,
      minimo: producto.minimo,
      precioCompra: producto.precioCompra,
      precioVenta: producto.precioVenta
    })

    setMensaje('')
    setMostrarFormulario(true)
  }

  const cambiarCampo = (campo, valor) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor
    }))
  }

  const guardarProducto = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (
      !formulario.codigo.trim() ||
      !formulario.producto.trim()
    ) {
      setMensaje(
        'Código y nombre del producto son obligatorios.'
      )
      return
    }

    const datos = {
      codigo: formulario.codigo.trim(),
      producto: formulario.producto.trim(),
      categoria: formulario.categoria.trim(),
      marca: formulario.marca.trim(),
      modelo: formulario.modelo.trim(),
      anio: formulario.anio.trim(),
      proveedor: formulario.proveedor.trim(),
      cantidad: Number(formulario.cantidad) || 0,
      minimo: Number(formulario.minimo) || 0,
      precio_compra:
        Number(formulario.precioCompra) || 0,
      precio_venta:
        Number(formulario.precioVenta) || 0,
      updated_at: new Date().toISOString()
    }

    let error

    if (editando) {
      const resultado = await supabase
        .from('productos')
        .update(datos)
        .eq('id', editando.id)

      error = resultado.error
    } else {
      const resultado = await supabase
        .from('productos')
        .insert(datos)

      error = resultado.error
    }

    if (error) {
      console.error(error)

      if (
        error.code === '23505'
      ) {
        setMensaje(
          'Ese código de producto ya existe.'
        )
      } else {
        setMensaje(
          'No se pudo guardar el producto.'
        )
      }

      return
    }

    setMostrarFormulario(false)
    setEditando(null)
    setFormulario(FORMULARIO_VACIO)

    await cargarProductos()
  }

  const eliminarProducto = async (producto) => {
    const confirmar =
      window.confirm(
        `¿Eliminar "${producto.producto}"?`
      )

    if (!confirmar) return

    const { error } =
      await supabase
        .from('productos')
        .delete()
        .eq('id', producto.id)

    if (error) {
      console.error(error)

      alert(
        'No se pudo eliminar el producto.'
      )

      return
    }

    await cargarProductos()
  }

  return (
    <>
      <div className="welcome">
        <div>
          <h2>Productos</h2>

          <p>
            Administra tus repuestos.
          </p>
        </div>

        <button
          className="login-button"
          style={{
            maxWidth: 220,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
          onClick={abrirNuevo}
        >
          <Plus size={19} />
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
              {productosFiltrados.length}{' '}
              producto(s)
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Search size={19} />

            <input
              type="text"
              placeholder="Buscar producto, código o marca..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              style={{
                padding: '11px 14px',
                borderRadius: 9,
                border: '1px solid #d1d5db',
                minWidth: 260
              }}
            />
          </div>

        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Año</th>
                <th>Stock</th>
                <th>Proveedor</th>
                <th>Venta</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {productosFiltrados.map(
                (producto) => (
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
                      {producto.categoria || '-'}
                    </td>

                    <td>
                      {producto.marca || '-'}
                    </td>

                    <td>
                      {producto.anio || '-'}
                    </td>

                    <td>
                      {producto.stock}
                    </td>

                    <td>
                      {producto.proveedor || '-'}
                    </td>

                    <td>
                      L{' '}
                      {producto.precioVenta.toLocaleString()}
                    </td>

                    <td>
                      <div
                        style={{
                          display: 'flex',
                          gap: 6
                        }}
                      >

                        <button
                          onClick={() =>
                            abrirEditar(producto)
                          }
                          title="Editar"
                          style={{
                            border: 0,
                            padding: 8,
                            borderRadius: 7,
                            cursor: 'pointer'
                          }}
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          onClick={() =>
                            eliminarProducto(
                              producto
                            )
                          }
                          title="Eliminar"
                          style={{
                            border: 0,
                            padding: 8,
                            borderRadius: 7,
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      </section>

      {mostrarFormulario && (
        <div style={modalFondo}>

          <div style={modalCaja}>

            <div style={modalHeader}>
              <div>
                <h3>
                  {editando
                    ? 'Editar producto'
                    : 'Nuevo producto'}
                </h3>

                <p>
                  Completa la información.
                </p>
              </div>

              <button
                onClick={() =>
                  setMostrarFormulario(false)
                }
                style={botonCerrar}
              >
                <X />
              </button>
            </div>

            <form onSubmit={guardarProducto}>

              <div style={formGrid}>

                <Campo
                  label="Código"
                  value={formulario.codigo}
                  onChange={(v) =>
                    cambiarCampo('codigo', v)
                  }
                  placeholder="Ej. 90915"
                />

                <Campo
                  label="Producto"
                  value={formulario.producto}
                  onChange={(v) =>
                    cambiarCampo('producto', v)
                  }
                  placeholder="Nombre del producto"
                />

                <Campo
                  label="Categoría"
                  value={formulario.categoria}
                  onChange={(v) =>
                    cambiarCampo('categoria', v)
                  }
                  placeholder="Filtros, iluminación..."
                />

                <Campo
                  label="Marca"
                  value={formulario.marca}
                  onChange={(v) =>
                    cambiarCampo('marca', v)
                  }
                  placeholder="Toyota, Isuzu..."
                />

                <Campo
                  label="Modelo"
                  value={formulario.modelo}
                  onChange={(v) =>
                    cambiarCampo('modelo', v)
                  }
                  placeholder="Modelo"
                />

                <Campo
                  label="Año"
                  value={formulario.anio}
                  onChange={(v) =>
                    cambiarCampo('anio', v)
                  }
                  placeholder="2019-2026"
                />

                <Campo
                  label="Proveedor"
                  value={formulario.proveedor}
                  onChange={(v) =>
                    cambiarCampo(
                      'proveedor',
                      v
                    )
                  }
                  placeholder="Proveedor"
                />

                <Campo
                  label="Cantidad"
                  type="number"
                  value={formulario.cantidad}
                  onChange={(v) =>
                    cambiarCampo(
                      'cantidad',
                      v
                    )
                  }
                />

                <Campo
                  label="Stock mínimo"
                  type="number"
                  value={formulario.minimo}
                  onChange={(v) =>
                    cambiarCampo(
                      'minimo',
                      v
                    )
                  }
                />

                <Campo
                  label="Precio compra"
                  type="number"
                  value={formulario.precioCompra}
                  onChange={(v) =>
                    cambiarCampo(
                      'precioCompra',
                      v
                    )
                  }
                />

                <Campo
                  label="Precio venta"
                  type="number"
                  value={formulario.precioVenta}
                  onChange={(v) =>
                    cambiarCampo(
                      'precioVenta',
                      v
                    )
                  }
                />

              </div>

              {mensaje && (
                <div style={mensajeError}>
                  <AlertTriangle size={17} />
                  {mensaje}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 10,
                  marginTop: 20
                }}
              >

                <button
                  type="button"
                  onClick={() =>
                    setMostrarFormulario(false)
                  }
                  style={botonSecundario}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  style={botonPrincipal}
                >
                  <Save size={17} />
                  Guardar
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </>
  )
}

/* =========================================================
   CAMPO
========================================================= */

function Campo({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = ''
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontWeight: 600,
          marginBottom: 6
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '11px 12px',
          border: '1px solid #d1d5db',
          borderRadius: 8
        }}
      />
    </div>
  )
}

/* =========================================================
   INVENTARIO
========================================================= */

function Inventario({
  productos,
  cargarProductos,
  usuario
}) {
  const [tipo, setTipo] =
    useState('entrada')

  const [productoId, setProductoId] =
    useState('')

  const [cantidad, setCantidad] =
    useState(1)

  const [motivo, setMotivo] =
    useState('')

  const [busqueda, setBusqueda] =
    useState('')

  const [mensaje, setMensaje] =
    useState('')

  const productoSeleccionado =
    productos.find(
      (p) =>
        String(p.id) ===
        String(productoId)
    )

  const productosFiltrados =
    productos.filter((p) => {
      const texto =
        busqueda.toLowerCase()

      return (
        p.producto
          .toLowerCase()
          .includes(texto) ||
        p.codigo
          .toLowerCase()
          .includes(texto)
      )
    })

  const registrarMovimiento =
    async (e) => {
      e.preventDefault()
      setMensaje('')

      if (!productoSeleccionado) {
        setMensaje(
          'Selecciona un producto.'
        )
        return
      }

      const cantidadMovimiento =
        Number(cantidad)

      if (
        !cantidadMovimiento ||
        cantidadMovimiento <= 0
      ) {
        setMensaje(
          'La cantidad debe ser mayor que cero.'
        )
        return
      }

      if (
        tipo === 'salida' &&
        cantidadMovimiento >
          productoSeleccionado.stock
      ) {
        setMensaje(
          'No hay suficiente stock para realizar esta salida.'
        )
        return
      }

      const nuevoStock =
        tipo === 'entrada'
          ? productoSeleccionado.stock +
            cantidadMovimiento
          : productoSeleccionado.stock -
            cantidadMovimiento

      const { error: errorProducto } =
        await supabase
          .from('productos')
          .update({
            cantidad: nuevoStock,
            updated_at:
              new Date().toISOString()
          })
          .eq(
            'id',
            productoSeleccionado.id
          )

      if (errorProducto) {
        console.error(errorProducto)

        setMensaje(
          'No se pudo actualizar el inventario.'
        )

        return
      }

      const { error: errorMovimiento } =
        await supabase
          .from('movimientos')
          .insert({
            producto_id:
              productoSeleccionado.id,
            tipo,
            cantidad:
              cantidadMovimiento,
            usuario:
              usuario.usuario,
            motivo:
              motivo.trim() || null
          })

      if (errorMovimiento) {
        console.error(
          errorMovimiento
        )
      }

      setCantidad(1)
      setMotivo('')
      setMensaje(
        tipo === 'entrada'
          ? 'Entrada registrada correctamente.'
          : 'Salida registrada correctamente.'
      )

      await cargarProductos()
    }

  return (
    <>
      <div className="welcome">
        <div>
          <h2>Inventario</h2>

          <p>
            Registra entradas y salidas.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(280px, 420px) 1fr',
          gap: 20,
          alignItems: 'start'
        }}
      >

        <section className="panel">

          <div className="panel-header">
            <div>
              <h3>
                Movimiento
              </h3>

              <p>
                Actualiza el stock.
              </p>
            </div>
          </div>

          <form
            onSubmit={
              registrarMovimiento
            }
          >

            <div
              style={{
                display: 'flex',
                gap: 8,
                marginBottom: 18
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setTipo('entrada')
                }
                style={{
                  ...tipoBoton,
                  ...(tipo === 'entrada'
                    ? tipoActivo
                    : {})
                }}
              >
                <ArrowDownToLine
                  size={17}
                />
                Entrada
              </button>

              <button
                type="button"
                onClick={() =>
                  setTipo('salida')
                }
                style={{
                  ...tipoBoton,
                  ...(tipo === 'salida'
                    ? tipoActivoSalida
                    : {})
                }}
              >
                <ArrowUpFromLine
                  size={17}
                />
                Salida
              </button>

            </div>

            <label style={labelStyle}>
              Producto
            </label>

            <select
              value={productoId}
              onChange={(e) =>
                setProductoId(
                  e.target.value
                )
              }
              style={inputStyle}
            >
              <option value="">
                Selecciona un producto
              </option>

              {productos.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                >
                  {p.codigo} - {p.producto}
                </option>
              ))}
            </select>

            {productoSeleccionado && (
              <div
                style={{
                  padding: 12,
                  borderRadius: 9,
                  background:
                    '#f1f5f9',
                  marginBottom: 15
                }}
              >
                Stock actual:{' '}
                <strong>
                  {
                    productoSeleccionado.stock
                  }
                </strong>
              </div>
            )}

            <label style={labelStyle}>
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
              style={inputStyle}
            />

            <label style={labelStyle}>
              Motivo
            </label>

            <input
              type="text"
              placeholder="Compra, venta, devolución..."
              value={motivo}
              onChange={(e) =>
                setMotivo(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            {mensaje && (
              <div
                style={{
                  padding: 12,
                  marginBottom: 15,
                  borderRadius: 8,
                  background:
                    mensaje.includes(
                      'correctamente'
                    )
                      ? '#dcfce7'
                      : '#fee2e2'
                }}
              >
                {mensaje}
              </div>
            )}

            <button
              type="submit"
              style={{
                ...botonPrincipal,
                width: '100%'
              }}
            >
              <Save size={17} />
              Registrar movimiento
            </button>

          </form>
        </section>

        <section className="panel">

          <div className="panel-header">

            <div>
              <h3>
                Existencias
              </h3>

              <p>
                Stock actual
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7
              }}
            >
              <Search size={18} />

              <input
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
                style={{
                  padding: '9px 11px',
                  border:
                    '1px solid #d1d5db',
                  borderRadius: 8
                }}
              />
            </div>

          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Marca</th>
                  <th>Stock</th>
                  <th>Mínimo</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>

                {productosFiltrados.map(
                  (p) => {
                    const bajo =
                      p.stock <= p.minimo

                    return (
                      <tr key={p.id}>

                        <td>{p.codigo}</td>

                        <td>
                          <strong>
                            {p.producto}
                          </strong>
                        </td>

                        <td>
                          {p.marca || '-'}
                        </td>

                        <td>
                          {p.stock}
                        </td>

                        <td>
                          {p.minimo}
                        </td>

                        <td>
                          {bajo ? (
                            <span className="badge danger">
                              ⚠ Bajo
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

      </div>
    </>
  )
}

/* =========================================================
   ESCÁNER
========================================================= */

function Escaner({
  productos,
  cargarProductos,
  cambiarSeccion
}) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const [codigo, setCodigo] =
    useState('')

  const [resultado, setResultado] =
    useState(null)

  const [escaneando, setEscaneando] =
    useState(false)

  const [mensaje, setMensaje] =
    useState('')

  const buscarCodigo = (codigoBuscado) => {
    const texto =
      codigoBuscado.trim()

    if (!texto) return

    const encontrado =
      productos.find(
        (p) =>
          p.codigo.toLowerCase() ===
          texto.toLowerCase()
      )

    setResultado(
      encontrado || null
    )

    if (!encontrado) {
      setMensaje(
        'No encontramos un producto con ese código.'
      )
    } else {
      setMensaje('')
    }
  }

  const iniciarCamara = async () => {
    setMensaje('')

    if (
      !('BarcodeDetector' in window)
    ) {
      setMensaje(
        'Este navegador no tiene BarcodeDetector. Puedes escribir el código manualmente.'
      )
      return
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: {
                ideal: 'environment'
              }
            }
          }
        )

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream

        await videoRef.current.play()
      }

      setEscaneando(true)

      const detector =
        new window.BarcodeDetector({
          formats: [
            'code_128',
            'code_39',
            'ean_13',
            'ean_8',
            'upc_a',
            'upc_e',
            'qr_code'
          ]
        })

      const detectar = async () => {
        if (
          !videoRef.current ||
          !streamRef.current
        ) {
          return
        }

        try {
          const codes =
            await detector.detect(
              videoRef.current
            )

          if (
            codes &&
            codes.length > 0
          ) {
            const valor =
              codes[0].rawValue

            setCodigo(valor)
            buscarCodigo(valor)
            detenerCamara()
            return
          }
        } catch (error) {
          console.error(error)
        }

        if (streamRef.current) {
          requestAnimationFrame(
            detectar
          )
        }
      }

      detectar()
    } catch (error) {
      console.error(error)

      setMensaje(
        'No se pudo acceder a la cámara. Revisa los permisos del navegador.'
      )
    }
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

    setEscaneando(false)
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
          <h2>Escáner</h2>

          <p>
            Busca rápidamente un repuesto por código.
          </p>
        </div>
      </div>

      <section className="panel">

        <div className="panel-header">
          <div>
            <h3>
              Escanear código
            </h3>

            <p>
              Usa la cámara o escribe el código.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 20
          }}
        >

          <input
            value={codigo}
            onChange={(e) =>
              setCodigo(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                buscarCodigo(codigo)
              }
            }}
            placeholder="Código del producto"
            style={{
              flex: 1,
              minWidth: 220,
              padding: '12px 14px',
              border:
                '1px solid #d1d5db',
              borderRadius: 8
            }}
          />

          <button
            onClick={() =>
              buscarCodigo(codigo)
            }
            style={botonPrincipal}
          >
            <Search size={17} />
            Buscar
          </button>

          {!escaneando ? (
            <button
              onClick={iniciarCamara}
              style={botonPrincipal}
            >
              <ScanLine size={17} />
              Escanear
            </button>
          ) : (
            <button
              onClick={detenerCamara}
              style={botonSecundario}
            >
              <XCircle size={17} />
              Detener cámara
            </button>
          )}

        </div>

        {escaneando && (
          <div
            style={{
              maxWidth: 500,
              margin: '0 auto 20px'
            }}
          >
            <video
              ref={videoRef}
              muted
              playsInline
              style={{
                width: '100%',
                borderRadius: 12,
                background: '#000'
              }}
            />

            <p
              style={{
                textAlign: 'center'
              }}
            >
              Apunta la cámara al código.
            </p>
          </div>
        )}

        {mensaje && (
          <div
            style={{
              padding: 14,
              borderRadius: 9,
              background: '#fff7ed',
              marginBottom: 15
            }}
          >
            {mensaje}
          </div>
        )}

        {resultado && (
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              background: '#f8fafc',
              border:
                '1px solid #e2e8f0'
            }}
          >

            <h3>
              {resultado.producto}
            </h3>

            <p>
              Código:{' '}
              <strong>
                {resultado.codigo}
              </strong>
            </p>

            <p>
              Marca:{' '}
              {resultado.marca || '-'}
            </p>

            <p>
              Stock:{' '}
              <strong>
                {resultado.stock}
              </strong>
            </p>

            <p>
              Precio de venta: L{' '}
              {resultado.precioVenta.toLocaleString()}
            </p>

            <button
              onClick={() =>
                cambiarSeccion(
                  'inventario'
                )
              }
              style={botonPrincipal}
            >
              <ArrowDownToLine size={17} />
              Ir a inventario
            </button>

          </div>
        )}

      </section>
    </>
  )
}

/* =========================================================
   USUARIOS
========================================================= */

function Usuarios() {
  const [usuarios, setUsuarios] =
    useState([])

  const [cargando, setCargando] =
    useState(true)

  const cargarUsuarios =
    async () => {
      setCargando(true)

      const { data, error } =
        await supabase
          .from('usuarios')
          .select(
            'id, usuario, nombre, rol, activo, created_at'
          )
          .order('id')

      if (error) {
        console.error(error)
      } else {
        setUsuarios(data || [])
      }

      setCargando(false)
    }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cambiarEstado =
    async (usuario) => {
      const { error } =
        await supabase
          .from('usuarios')
          .update({
            activo:
              !usuario.activo
          })
          .eq(
            'id',
            usuario.id
          )

      if (error) {
        alert(
          'No se pudo cambiar el estado.'
        )
        return
      }

      cargarUsuarios()
    }

  return (
    <>
      <div className="welcome">
        <div>
          <h2>Usuarios</h2>

          <p>
            Usuarios registrados en el sistema.
          </p>
        </div>
      </div>

      <section className="panel">

        <div className="panel-header">
          <div>
            <h3>
              Usuarios
            </h3>

            <p>
              {usuarios.length}{' '}
              usuario(s)
            </p>
          </div>

          <button
            onClick={cargarUsuarios}
            style={botonSecundario}
          >
            <RefreshCw size={17} />
            Actualizar
          </button>
        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>

              {cargando ? (
                <tr>
                  <td colSpan="5">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map(
                  (u) => (
                    <tr key={u.id}>

                      <td>
                        <strong>
                          {u.usuario}
                        </strong>
                      </td>

                      <td>
                        {u.nombre}
                      </td>

                      <td>
                        {u.rol}
                      </td>

                      <td>
                        {u.activo ? (
                          <span className="badge success">
                            Activo
                          </span>
                        ) : (
                          <span className="badge danger">
                            Inactivo
                          </span>
                        )}
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            cambiarEstado(u)
                          }
                          style={
                            botonSecundario
                          }
                        >
                          {u.activo
                            ? 'Desactivar'
                            : 'Activar'}
                        </button>
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

/* =========================================================
   ESTILOS EN LÍNEA AUXILIARES
========================================================= */

const modalFondo = {
  position: 'fixed',
  inset: 0,
  background:
    'rgba(15, 23, 42, .65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  zIndex: 1000,
  overflowY: 'auto'
}

const modalCaja = {
  width: '100%',
  maxWidth: 850,
  background: '#fff',
  borderRadius: 14,
  padding: 22,
  boxSizing: 'border-box',
  maxHeight: '92vh',
  overflowY: 'auto'
}

const modalHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20
}

const botonCerrar = {
  border: 0,
  background: '#f1f5f9',
  borderRadius: 8,
  padding: 8,
  cursor: 'pointer'
}

const formGrid = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(210px, 1fr))',
  gap: 15
}

const mensajeError = {
  marginTop: 15,
  padding: 12,
  borderRadius: 8,
  background: '#fee2e2',
  display: 'flex',
  gap: 8,
  alignItems: 'center'
}

const botonPrincipal = {
  border: 0,
  borderRadius: 8,
  padding: '11px 16px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
  fontWeight: 600,
  background: '#0f172a',
  color: '#fff'
}

const botonSecundario = {
  border: '1px solid #d1d5db',
  borderRadius: 8,
  padding: '10px 14px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
  background: '#fff'
}

const tipoBoton = {
  flex: 1,
  border: '1px solid #d1d5db',
  borderRadius: 8,
  padding: 11,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  background: '#fff'
}

const tipoActivo = {
  background: '#dcfce7',
  borderColor: '#22c55e'
}

const tipoActivoSalida = {
  background: '#fee2e2',
  borderColor: '#ef4444'
}

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  marginBottom: 6
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '11px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  marginBottom: 15
}

/* =========================================================
   APP PRINCIPAL
========================================================= */

function App() {
  const [usuario, setUsuario] =
    useState(() => {
      try {
        const guardado =
          localStorage.getItem(
            'inventario_usuario'
          )

        return guardado
          ? JSON.parse(guardado)
          : null
      } catch {
        return null
      }
    })

  const [menuAbierto, setMenuAbierto] =
    useState(false)

  const [seccion, setSeccion] =
    useState('dashboard')

  const [productos, setProductos] =
    useState([])

  const [cargando, setCargando] =
    useState(false)

  /* =====================================================
     CARGAR PRODUCTOS
  ===================================================== */

  const cargarProductos =
    async () => {
      setCargando(true)

      const { data, error } =
        await supabase
          .from('productos')
          .select('*')
          .order('id', {
            ascending: true
          })

      if (error) {
        console.error(
          'Error cargando productos:',
          error
        )

        setCargando(false)
        return
      }

      if (data && data.length > 0) {
        setProductos(
          data.map(convertirProducto)
        )
      } else {
        /*
          Si todavía no tienes productos
          en Supabase, se muestran los
          productos de ejemplo solamente
          en pantalla.
        */
        setProductos(
          PRODUCTOS_INICIALES
        )
      }

      setCargando(false)
    }

  /* =====================================================
     SINCRONIZACIÓN EN TIEMPO REAL
  ===================================================== */

  useEffect(() => {
    if (!usuario) return

    cargarProductos()

    const canal =
      supabase
        .channel(
          'inventario-productos'
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'productos'
          },
          () => {
            cargarProductos()
          }
        )
        .subscribe()

    return () => {
      supabase.removeChannel(
        canal
      )
    }
  }, [usuario])

  /* =====================================================
     LOGIN
  ===================================================== */

  const iniciarSesion = (
    usuarioIngresado
  ) => {
    setUsuario(
      usuarioIngresado
    )

    setSeccion(
      'dashboard'
    )
  }

  /* =====================================================
     LOGOUT
  ===================================================== */

  const cerrarSesion = () => {
    localStorage.removeItem(
      'inventario_usuario'
    )

    setUsuario(null)
    setMenuAbierto(false)
  }

  /* =====================================================
     CAMBIAR SECCIÓN
  ===================================================== */

  const cambiarSeccion = (
    nuevaSeccion
  ) => {
    setSeccion(nuevaSeccion)
    setMenuAbierto(false)
  }

  if (!usuario) {
    return (
      <Login
        onLogin={
          iniciarSesion
        }
      />
    )
  }

  return (
    <div className="app">

      {/* =================================================
          BARRA SUPERIOR
      ================================================= */}

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
            onClick={cerrarSesion}
          >
            <LogOut size={19} />

            <span>
              Cerrar sesión
            </span>
          </button>

        </div>

      </header>

      {/* =================================================
          SIDEBAR
      ================================================= */}

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
          <LayoutDashboard
            size={19}
          />
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
          onClick={cerrarSesion}
        >
          <LogOut size={19} />
          Cerrar sesión
        </button>

      </aside>

      {/* =================================================
          CONTENIDO
      ================================================= */}

      <main className="content">

        {cargando && (
          <div
            style={{
              padding: 10,
              textAlign: 'right',
              fontSize: 13,
              opacity: 0.7
            }}
          >
            Actualizando inventario...
          </div>
        )}

        {seccion === 'dashboard' && (
          <Dashboard
            usuario={usuario}
            onLogout={
              cerrarSesion
            }
            productos={
              productos
            }
            cambiarSeccion={
              cambiarSeccion
            }
            cargarProductos={
              cargarProductos
            }
          />
        )}

        {seccion === 'productos' && (
          <Productos
            productos={
              productos
            }
            cargarProductos={
              cargarProductos
            }
            usuario={usuario}
          />
        )}

        {seccion === 'inventario' && (
          <Inventario
            productos={
              productos
            }
            cargarProductos={
              cargarProductos
            }
            usuario={usuario}
          />
        )}

        {seccion === 'escaner' && (
          <Escaner
            productos={
              productos
            }
            cargarProductos={
              cargarProductos
            }
            cambiarSeccion={
              cambiarSeccion
            }
          />
        )}

        {seccion === 'usuarios' && (
          <Usuarios />
        )}

      </main>

    </div>
  )
}

/* =========================================================
   INICIAR APLICACIÓN
========================================================= */

createRoot(
  document.getElementById('root')
).render(
  <App />
)
