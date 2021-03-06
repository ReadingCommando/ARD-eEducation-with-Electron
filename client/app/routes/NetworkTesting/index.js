import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Progress, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';

import TitleBar from '../../components/TitleBar';

import './index.scss';

const FormItem = Form.Item;

@inject('ClientStore')
@observer
class NetworkTesting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      networkQuality: 2
    };
    try {
      this.$rtc = props.ClientStore.$rtc.rtcEngine;
    } catch (err) {
      console.error(err);
      window.location.hash = '';
    }
  }

  componentDidMount() {
    this.$rtc.on('lastmilequality', (quality) => {
      // console.log(quality)
      this.setState({
        networkQuality: quality
      });
    });
    this.$rtc.enableLastmileTest();
  }

  componentWillUnmount() {
    this.$rtc.disableLastmileTest();
  }

  componentDidCatch(err, info) {
    console.error(err);
    window.location.hash = '';
  }

  render() {
    return (
      <div className="wrapper" id="networkTesting">
        <header className="title">
          <TitleBar />
        </header>
        <main className="main">
          <section className="content">
            <header>
              <img src={require('../../assets/images/logo.png')} alt="" />
            </header>
            <main>
              <Form>
                <FormItem
                  label={(
                    <img style={{ width: '24px' }} src={require('../../assets/images/connection.png')} alt="" />
                )}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  colon={false}
                >
                  <Progress percent={30} showInfo={false} />
                </FormItem>
              </Form>
              <Row>
                <Col span={12}>
                  <header className="stats-title">Packet Loss</header>
                  <main className="stats-body">
                    0%
                  </main>
                </Col>
                <Col span={12}>
                  <header className="stats-title">Delay Time</header>
                  <main className="stats-body">
                    29 ms
                  </main>
                </Col>
                <Col span={12}>
                  {/* <header className="stats-title">Network Status</header>
                  <main className="stats-body">
                    <div className="network-status">
                      Good
                    </div>
                  </main> */}
                  <NetworkStatus quality={this.state.networkQuality} />
                </Col>
              </Row>
            </main>
          </section>
          <section className="illustration">
            <h3 className="title">Network Testing</h3>

            <div className="button-group">
              <Button size="large" id="nextBtn" type="primary">
                <Link to="/classroom">Next Step -></Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

function NetworkStatus(props) {
  const profile = {
    0: {
      text: 'unknown', color: '#000', bgColor: '#FFF'
    },
    1: {
      text: 'excellent', color: '', bgColor: ''
    },
    2: {
      text: 'good', color: '#7ED321', bgColor: '#B8E986'
    },
    3: {
      text: 'poor', color: '#F5A623', bgColor: '#F8E71C'
    },
    4: {
      text: 'bad', color: '#FF4D89', bgColor: '#FF9EBF'
    },
    5: {
      text: 'vbad', color: '', bgColor: ''
    },
    6: {
      text: 'down', color: '#4A90E2', bgColor: '#86D9E9'
    }
  };

  const quality = (function () {
    switch (props.quality) {
      default:
      case 0:
        return profile[0];
      case 1:
      case 2:
        return profile[2];
      case 3:
        return profile[3];
      case 4:
      case 5:
        return profile[4];
      case 6:
        return profile[6];
    }
  }());

  return (
    <section>
      <header className="stats-title">Network Status</header>
      <main className="stats-body">
        <div
          className="network-status"
          style={{
          color: quality.color,
          backgroudColor: quality.bgColor
        }}
        >
          { quality.text }
        </div>
      </main>
    </section>
  );
}

export default NetworkTesting;
