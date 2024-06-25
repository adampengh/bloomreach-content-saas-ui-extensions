'use client'
import { useState } from 'react'

// Components
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';


const ConvertPageLayoutComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const steps = ['Select Page', 'Map Layout', 'Convert Page'];

  // const isStepOptional = (step) => {
  //   return step === 1;
  // };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleSkip = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped((prevSkipped) => {
  //     const newSkipped = new Set(prevSkipped.values());
  //     newSkipped.add(activeStep);
  //     return newSkipped;
  //   });
  // };

  const handleReset = () => {
    setActiveStep(0);
  };

  const ActiveStep = ({ activeStep }) => {
    switch (activeStep) {
      case 0:
        return (<StepSelectPage />)
      case 1:
        return (<StepMapFields />)
      case 2:
        return (<StepConvertPage />)
    }
  }

  const StepSelectPage = () => {
    return (
      <h1>Select Page</h1>
    )
  }

  const StepMapFields = () => {
    return (
      <h1>Map Layout</h1>
    )
  }

  const StepConvertPage = () => {
    return (
      <h1>Convert Page</h1>
    )
  }

  return (
    <>
      <Container maxWidth='lg'>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='stretch'
          alignContent='stretch'
          sx={{
            '& .MuiGrid-item': {
              textAlign: 'center'
            },
            '& .MuiCircularProgress-root': {
              margin: '24px'
            }
          }}
        >
          <Grid item xs={12}>
            <Card>
              <CardHeader title={steps[activeStep]} sx={{ textAlign: 'left' }} />
              <Divider />
              <CardContent>
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>

                {activeStep === steps.length ? (
                  <>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button onClick={handleReset}>Reset</Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <ActiveStep activeStep={activeStep} />

                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Button
                        color='inherit'
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default ConvertPageLayoutComponent
