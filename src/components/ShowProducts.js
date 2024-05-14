import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ShowProducts = () => {
    const url = 'http://localhost:8000/agustintavernacrud/productos';
    const [productos, setProductos] = useState([]);
    const [productosUSD, setProductosUSD] = useState([]);
    const [id, setId] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');
    const [precio, setPrecio] = useState('');
    const [title, setTitle] = useState('');
    const [showUSD, setShowUSD] = useState(false);

    useEffect(() => {
        getProductos();
    }, []);

    const getProductos = async () => {
        const respuesta = await axios.get(url);
        setProductos(respuesta.data);
    };

    const openModal = (tipo, producto = {}) => {
        setTitle(tipo === 'agregar' ? 'Agregar Producto' : 'Editar Producto');
        setId(producto.id || '');
        setNombreProducto(producto.nombre_producto || '');
        setPrecio(producto.precio || '');
    };

    const addProducto = async () => {
        try {
            const data = {
                nombre_producto: nombreProducto,
                precio: precio
            };
            await axios.post('http://localhost:8000/agustintavernacrud/productos/create', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            Swal.fire('Agregado', 'Producto agregado correctamente', 'success');
            getProductos();
            if (showUSD) calculateUSD();  // Actualizar precios en USD después de agregar producto si está activado
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Hubo un problema al agregar el producto', 'error');
        }
    };

    const updateProducto = async () => {
        try {
            const data = {
                id: id,
                nombre_producto: nombreProducto,
                precio: precio
            };
            await axios.put('http://localhost:8000/agustintavernacrud/productos', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            Swal.fire('Actualizado', 'Producto actualizado correctamente', 'success');
            getProductos();
            if (showUSD) calculateUSD();  // Actualizar precios en USD después de actualizar producto si está activado
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Hubo un problema al actualizar el producto', 'error');
        }
    };

    const deleteProducto = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.request({
                        url: 'http://localhost:8000/agustintavernacrud/productos',
                        method: 'delete',
                        data: { id: id },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true
                    });

                    Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
                    getProductos();
                    if (showUSD) calculateUSD();  // Actualizar precios en USD después de eliminar producto si está activado
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error', 'Hubo un problema al eliminar el producto', 'error');
                }
            }
        });
    };

    const handleSave = () => {
        if (id) {
            updateProducto();
        } else {
            addProducto();
        }
    };

    const calculateUSD = async () => {
        try {
            const response = await axios.post('http://localhost:8000/agustintavernacrud/productos/usd');
            setProductosUSD(response.data);
            setShowUSD(true);
        } catch (error) {
            console.error('There was an error fetching the USD prices!', error);
            Swal.fire('Error', 'Hubo un problema al obtener los precios en USD', 'error');
        }
    };

    const toggleUSD = () => {
        setShowUSD(prevShowUSD => !prevShowUSD);
    };

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-4'>
                        <div className='d-grid mx-auto'>
                            <button 
                                className='btn btn-success' 
                                data-bs-toggle='modal' 
                                data-bs-target='#modalProductos'
                                onClick={() => openModal('agregar')}
                            >
                                <i className='fa-solid fa-circle-plus'> Agregar</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-lg-6 offset-0 offset-lg-3'>
                    <div className='table-responsive'>
                        <button onClick={showUSD ? toggleUSD : calculateUSD} className='btn btn-primary mb-3'>
                            {showUSD ? 'Ocultar precio en USD' : 'Calcular precio en USD'}
                        </button>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Nombre del Producto</th>
                                    <th>Precio</th>
                                    {showUSD && <th>Precio en USD</th>}
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {productos.map((producto, i) => (
                                    <tr key={producto.id}>
                                        <td>{i + 1}</td>
                                        <td>{producto.nombre_producto}</td>
                                        <td>{producto.precio}</td>
                                        {showUSD && <td>{productosUSD[i]?.precio_usd || 'N/A'}</td>}
                                        <td>
                                            <button 
                                                className='btn btn-warning'
                                                data-bs-toggle='modal'
                                                data-bs-target='#modalProductos'
                                                onClick={() => openModal('editar', producto)}
                                            >
                                                <i className='fa solid fa-edit'></i>
                                            </button>
                                            &nbsp;
                                            <button 
                                                className='btn btn-danger'
                                                onClick={() => deleteProducto(producto.id)}
                                            >
                                                <i className='fa solid fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div id='modalProductos' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h6'>{title}</label>
                            <button className='btn-close' type='button' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id' value={id} onChange={(e) => setId(e.target.value)}></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Nombre</span>
                                <input 
                                    type='text' 
                                    id='nombre_producto' 
                                    className='form-control' 
                                    placeholder='Nombre' 
                                    value={nombreProducto} 
                                    onChange={(e) => setNombreProducto(e.target.value)} 
                                />
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Precio</span>
                                <input 
                                    type='text' 
                                    id='precio' 
                                    className='form-control' 
                                    placeholder='Precio' 
                                    value={precio} 
                                    onChange={(e) => setPrecio(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button className='btn btn-primary' type='button' onClick={handleSave}>Guardar</button>
                            <button id='btnClose' className='btn btn-secondary' type='button' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowProducts;
