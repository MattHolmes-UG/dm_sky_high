import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";
import { Container } from "@material-ui/core";
import { userAuth } from "services/auth";
import { useHistory } from "react-router-dom";

const styles = {
  wrapper: {
    marginTop: "15vh"
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [username, setusername] = useState('demo');
  const [psw, setPsw] = useState('demo');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUsernameChange = (event) => {
    setusername(event.target.value);
  }

  const handlePswChange = (event) => {
    setPsw(event.target.value);
  }

  const signIn = () => {
    if (userAuth.authenticate(username, psw)) {
      setSuccess(true);
      userAuth.signIn();
      history.push('/user/dashboard');
    } else {
      setErr('Incorrect username or password');
    }
  };
  return (
    <div className={classes.wrapper}>
      <Container maxWidth="xs">
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Login</h4>
            <p className={classes.cardCategoryWhite}>Please login to proceed</p>
          </CardHeader>
          <CardBody>
            <CustomInput
              labelText="Username"
              id="username"
              formControlProps={{
                fullWidth: true,
              }}
              success={success}
              inputProps={{
                error: !!err,
                value: username,
                required: true,
                onChange: handleUsernameChange,
              }}
            />
            <CustomInput
              labelText="Password"
              id="psw"
              formControlProps={{
                fullWidth: true,
              }}
              success={success}
              inputProps={{
                error: !!err,
                value: psw,
                required: true,
                onChange: handlePswChange,
              }}
            />
          </CardBody>
          <CardFooter>
            <Button color="primary" onClick={signIn}>
              Update Profile
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
}
