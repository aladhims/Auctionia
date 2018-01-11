import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import classNames from 'classnames';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { DateTimePicker } from 'material-ui-pickers';
import { FormControl } from 'material-ui/Form';
import { CircularProgress } from 'material-ui/Progress';
import Firebase from 'firebase'
import green from 'material-ui/colors/green';
import CheckIcon from 'material-ui-icons/Check';
import SaveIcon from 'material-ui-icons/Save';
import { CREATE_AUCTION } from '../queries';
import { graphql } from 'react-apollo'

const categories = ['Pakaian','Kendaraan','Emas','Antik', 'Properti','Elektronik','Kerajinan']

const styles = theme => ({
  root: {
    width: '90%',
    margin: '0 auto',
    height: '90vh',
  },
  formElements: {
      width: '50%',
  },
  firstWrapper: {
    display: 'flex',
    flexDirection: 'column'  
  },
  secondWrapper: {
      display: 'flex',
      flexDirection: 'column'
  },
  timeWrapper: {
      display: 'flex',
  },
  singleTime: {
      display: 'flex',
      flexDirection: 'column',
      marginRight: '5%'
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
    zIndex: 1,
  },
  rootUp: {
    width: 60,
    height: 60,
    marginLeft: 8,
    opacity: 0,
	  overflow: 'hidden',
	  position: 'absolute',
	  zIndex: 2,
  },
  resetContainer: {
    marginTop: 0,
    padding: theme.spacing.unit * 3, // TODO: See TODO note on Stepper
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

function getSteps() {
  return ['Informasi Lelang', 'Harga dan Durasi', 'Tambahkan Foto'];
}

class CreateAuction extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        success: false,
        loading: false,
        activeStep: 0,
        judul: "",
        desc: "",
        photo: "",
        startTime: new Date(),
        endTime: new Date(),
        initialPrice: 0,
        kategori: getSteps()[0]
      };

      this.handleNext = this.handleNext.bind(this);
      this.handleBack = this.handleBack.bind(this);
      this.getStepContent = this.getStepContent.bind(this);
      this.handlePost = this.handlePost.bind(this);
  }

  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
  };

  getStepContent(step,classes) {
    switch (step) {
      case 0:
        return (
            <div className={classes.firstWrapper}>
                <TextField
                  required
                  value={this.state.judul}
                  label="Judul"
                  placeholder="Judul untuk lelang anda"
                  className={classes.formElements}
                  margin="normal"
                  onChange={e => this.setState({ judul: e.target.value})}
                  />
                <TextField
                  label="Deskripsi"
                  multiline
                  value={this.state.desc}
                  placeholder="Deskripsikan Barang Lelang Anda"
                  className={classes.formElements}
                  margin="normal"
                  onChange={e => this.setState({ desc: e.target.value})}
                  />
                  <Select
                      value={this.state.kategori}
                      className={classes.formElements}
                      onChange={e => this.setState({kategori: e.target.value})}
                      input={<Input name="age" id="age-simple" />}>
                      {categories.map((category,key) => <MenuItem key={key} value={category}>{category}</MenuItem>)}
                  </Select>
            </div>
        );

      case 1:
        return (
            <div className={classes.secondWrapper}>
                <div className={classes.timeWrapper}>
                    <div className={classes.singleTime}>
                        <Typography type="caption" align="center">Waktu Mulai</Typography>
                        <DateTimePicker
                            value={this.state.startTime}
                            onChange={dateTime => this.setState({startTime: dateTime})}
                            />
                    </div>
                    <div className={classes.singleTime}>
                        <Typography type="caption" align="center">Waktu Selesai</Typography>
                        <DateTimePicker
                            value={this.state.endTime}
                            onChange={dateTime => this.setState({endTime: dateTime})}
                            />
                    </div>
                    
                </div>
                <FormControl 
                className={classes.formElements}
                margin="normal" error={this.state.error} aria-describedby="name-error-text">
                        <InputLabel htmlFor="bid">Harga Awal</InputLabel>
                            <Input
                                fullWidth={false}
                                id="bid"
                                startAdornment={<InputAdornment position="start">Rp. </InputAdornment>}
                                placeholder="Masukkan Harga Awal Anda"
                                value={this.state.initialPrice}
                                onChange={e => this.setState({initialPrice: e.target.value})}
                                inputProps={{
                                    'aria-label': 'Description',
                                    }}
                                />
                </FormControl>
            </div>
        
        )
      case 2:
        const { success, loading } = this.state;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: success,
        });
        return (
                <div>
                    <input type="file" name="file" id="file" onChange={this.handleUpload} className={classes.rootUp}/>
                    <div className={classes.wrapper}>
                        <Button fab color="primary" className={buttonClassname}>
                        {success ? <CheckIcon /> : <SaveIcon />}
                        </Button>
                        {loading && <CircularProgress size={68} className={classes.fabProgress} />}
                    </div>
                </div>
        );
      default:
        return 'Unknown step';
    }
  }

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  async handlePost(){
    const { judul, desc, photo,startTime, endTime, initialPrice, kategori} = this.state;

    try {
      const result = await this.props.createLelang({
        variables: {
          title: judul,
          description: desc,
          photo,
          startTime,
          endTime,
          initialprice: parseInt(initialPrice),
          category: kategori
        }
      });
      console.log(result);
      this.props.history.push('/app/myauction')
    }catch(err){
      console.log(err);
    }
  }

  handleUpload = (e) => {
    if (!this.state.loading) {
        this.setState(
          {
            success: false,
            loading: true,
          }
        );
        const file = e.target.files[0];
            const ref = Firebase.storage().ref(`lelang/${file.name}`);
            const task = ref.put(file);

            task.on('state_changed',() => {

            },(err) => {
                this.setState({
                    loading: false,
                    success: true,
                });
            },() => {
              const url = task.snapshot.downloadURL;
                this.setState({
                    loading: false,
                    success: true,
                    photo: url,
                });
            })
      }
    


  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical" style={{marginTop: '6%'}}>
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                {this.getStepContent(index,classes)}
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Kembali
                      </Button>
                      <Button
                        raised
                        color="primary"
                        onClick={activeStep === steps.length - 1 ? this.handlePost : this.handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1 ? 'Selesai' : 'Lanjut'}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&quot;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}

CreateAuction.propTypes = {
  classes: PropTypes.object,
};

export default graphql(CREATE_AUCTION,{name: "createLelang"})(withStyles(styles)(CreateAuction));