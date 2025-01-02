'use client'

// Components
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

export default function PermissionsTable() {
  return (
    <>
    <Divider sx={{ mt: 6 }}/>
    <Container maxWidth='xl' sx={{ mt: 6 }}>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='stretch'
        spacing={3}
      >
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Permissions Matrix' />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table sx={{ minWidth: 700 }} aria-label='spanning table'>
                  <TableHead>
                    <TableRow>
                      <TableCell align='left' colSpan={3}>Details</TableCell>
                      <TableCell align='right'>Price</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Desc</TableCell>
                      <TableCell align='right'>Qty.</TableCell>
                      <TableCell align='right'>Unit</TableCell>
                      <TableCell align='right'>Sum</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key='paperclips'>
                      <TableCell>Paperclips</TableCell>
                      <TableCell align='right'>100</TableCell>
                      <TableCell align='right'>1.15</TableCell>
                      <TableCell align='right'>115.00</TableCell>
                    </TableRow>
                    <TableRow key='paper'>
                      <TableCell>Paper</TableCell>
                      <TableCell align='right'>10</TableCell>
                      <TableCell align='right'>45.99</TableCell>
                      <TableCell align='right'>459.90</TableCell>
                    </TableRow>
                    <TableRow key='wasteBasket'>
                      <TableCell>Waste Basket</TableCell>
                      <TableCell align='right'>2</TableCell>
                      <TableCell align='right'>17.99</TableCell>
                      <TableCell align='right'>35.98</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell rowSpan={3} />
                      <TableCell colSpan={2}>Subtotal</TableCell>
                      <TableCell align='right'>610.88</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tax</TableCell>
                      <TableCell align='right'>7%</TableCell>
                      <TableCell align='right'>42.76</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell align='right'>653.64</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
    </>
  )
}
