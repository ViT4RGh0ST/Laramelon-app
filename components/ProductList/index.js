import React, { useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'
import moment from 'moment';
import sync from '../../database/sync';
import ProductDialog from '../dialogs/ProductDialog';

function ProductList({products, database}) {
  const productEmpty = {
    name: '',
    price: ''
  }
  const [productToEdit, setProductToEdit] = useState(null)
  const [open, setOpen] = useState(false)

  const handleDelete = async (product) => {
    await database.action(async () => {
      await product.markAsDeleted() // syncable
      // await product.destroyPermanently()
    })
  }

  const handleSync = async () => {
    await sync()
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 90 },
    { field: 'price', headerName: 'Price', width: 90, type: 'number' },
    { field: 'createdAt', headerName: 'Created At', width: 230,
      renderCell: (params) => moment(params.data.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    },
    { field: 'updatedAt', headerName: 'Updated At', width: 230,
      renderCell: (params) => moment(params.data.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    },
    { field: 'deletedAt', headerName: 'Deleted At', width: 50,
      renderCell: (params) => ( params.data._raw.deleted_at ? moment(params.data.deletedAt).format('YYYY-MM-DD HH:mm:ss') : '-')
    },
    { field: 'options', headerName: 'options', width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => {
              console.log(params.data._raw.deleted_at !== 0)
              setProductToEdit(params.data)
              setOpen(true)
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(params.data)}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 16 }}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ width: '80vw' }}>
      <div>
        <Button
          onClick={() => {
            handleSync()
          }}
          color="primary">
          Sync
        </Button>
        <Button
          onClick={() => {
            setProductToEdit(productEmpty)
            setOpen(true)
          }}
          color="primary">
          Add New Product
        </Button>
      </div>
      {productToEdit ? <ProductDialog open={open} setOpen={setOpen} product={productToEdit} setProductToEdit={setProductToEdit}/> : null}
      <DataGrid rows={products} columns={columns} pageSize={5} autoHeight={true} disableSelectionOnClick={true}/>
    </div>
  )
}

export default withDatabase(withObservables([], ({ database }) => ({
  products: database.collections.get('products').query().observe(),
}))(ProductList))