import React from 'react';
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';

export default ({product, setProductToEdit, open, setOpen}) => {
  const database = useDatabase()

  const [form, setForm] = React.useState({name: product.name, price: product.price})

  const handleUpdate = async () => {
    await database.action(async () => {
      await product.update(updateProduct => {
        updateProduct.name = form.name
        updateProduct.price = parseFloat(form.price)
      })
    })

    handleClose()
  }

  const handleSave = async () => {
    const pcoll = database.get('products')
    await database.action(async () => {
      await pcoll.create(productNew => {
        productNew.name = form.name
        productNew.price = parseFloat(form.price)
      })
    })
    handleClose()
  }

  const handleClose = async () => {
    setOpen(false)
    setProductToEdit(null)
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {
          product.name == '' && product.price == '' ?
          'Save'
          :
          'Update'
          }
        </DialogTitle>
        <DialogContent>
        <form noValidate autoComplete="off">
          <TextField
          onChange={(ev) => setForm({...form, name: ev.target.value})}
          defaultValue={product.name} style={{margin: 10}} id="standard-basic" label="Name" />
          <TextField
          onChange={(ev) => setForm({...form, price: ev.target.value})}
          defaultValue={product.price} style={{margin: 10}} id="standard-basic" label="Price" />
        </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {product.name == '' && product.price == '' ?
            <Button onClick={handleSave} color="primary" autoFocus>
              Save
            </Button>
            :
            <Button onClick={handleUpdate} color="primary" autoFocus>
              Update
            </Button>
          }

        </DialogActions>
      </Dialog>
    </div>
  )
}