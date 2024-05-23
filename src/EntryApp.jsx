import AppLayout from "/common/AppLayout";
import { Row, Col, Card } from 'antd';
import './EntryApp.css';

export default function EntryApp() {
    return (
        <AppLayout>
            <div className="home-container">
                <Row justify="center" align="middle" className="home-row">
                    <Col span={6} className="home-col">
                        <a href="/idgen/">
                            <Card className="home-card" title="ID Generator" >
                                <p>Generate centralized IDs</p>
                            </Card>
                        </a>
                    </Col>
                    <Col span={6} className="home-col">
                        <a href="/messenger/">
                            <Card className="home-card" title="Messenger">
                                <p>Asynchronously send SMS, Push and emails.</p>
                            </Card>
                        </a>
                    </Col>

                </Row>
            </div>
        </AppLayout>
    )
}
