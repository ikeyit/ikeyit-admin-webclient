import './SequenceListPage.css';
import {Alert, Button, Col, Form, Row, Select, Space, Table, Input} from "antd";
import {Link} from "react-router-dom";
import dayjs from "dayjs";
import {ClearOutlined, SearchOutlined} from "@ant-design/icons";
import {SEQUENCE_STATUSES, SEQUENCE_TYPES} from "./constant.js";
import {useSequenceSearcher} from "./hooks.js";
import {activateSequence} from "./loader.js";

export default function SequenceListPage() {
    const {data, status, error, search, params, setData} = useSequenceSearcher();
    const [form] = Form.useForm();

    function onPaginationChange(pagination) {
        search({
            ...params,
            page: pagination.page,
            pageSize: pagination.pageSize
        });
    }

    function onSearchFormFinish(v) {
        search({
            ...params,
            ...v,
            page: 1
        });
    }

    function onActivateClick(sequence) {
        activateSequence(sequence.name).then(() => {
            const content = data.content.map(c => c === sequence ? ({
                ...sequence,
                status: 3,
            }) : c);
            setData({
                ...data,
                content
            });
        }, e => {
            alert(e.message);
        });
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text, record) => <Link to={"/sequence/" + record.name + "/update"}>{text}</Link>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: status => SEQUENCE_STATUSES.get(status),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 200,
            render: status => SEQUENCE_TYPES.get(status),
        },
        {
            title: 'Max Id',
            dataIndex: 'maxId',
            key: 'maxId',
            width: 100,
        },
        {
            title: 'Step',
            dataIndex: 'step',
            key: 'step',
            width: 100,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 160,
        },
        {
            title: 'Creator',
            dataIndex: 'creatorId',
            key: 'creatorId',
            width: 100,
        },
        {
            title: 'Created At',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 160,
            render: (createTime) => dayjs(createTime).format('YY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Updater',
            dataIndex: 'updaterId',
            key: 'updaterId',
            width: 100,
        },
        {
            title: 'Updated At',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 160,
            render: (createTime) => dayjs(createTime).format('YY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Actions',
            dataIndex: 'name',
            key: 'op',
            fixed: 'right',
            render: (name, record) => (
                <Space>
                    {(record.status === 1 || record.status === 3) &&
                        <a onClick={() => onActivateClick(record)}>Activate</a>
                    }
                    <Link to={"/sequence/" + name + "/update"}>Edit</Link>
                </Space>
            ),
        }
    ];
    return (
        <>
            <Form
                form={form}
                initialValues={params}
                onFinish={onSearchFormFinish}
            >
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item
                            label="Name"
                            name="name"
                        >
                            <Input
                                placeholder="Input the name"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Status"
                            name="status"
                        >
                            <Select
                                allowClear
                                placeholder="Choose one status"
                                options={Array.from(SEQUENCE_STATUSES, ([k, v]) => ({label: v, value: k}))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Creator"
                            name="creatorId"
                        >
                            <Input
                                placeholder="Input the creator name"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                                    Search
                                </Button>
                                <Button type="default" htmlType="reset" icon={<ClearOutlined/>}>
                                    Reset
                                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            {status === "error" &&
                <Alert message={error.message} type="error"/>
            }
            <Table
                columns={columns}
                dataSource={data.content}
                rowKey="name"
                pagination={{
                    pageSize: data.pageSize,
                    total: data.total,
                    current: data.page,
                }}
                size="small"
                scroll={{
                    x: 1300,
                }}
                loading={{
                    delay: 100,
                    spinning: status === "loading"
                }}
                onChange={onPaginationChange}
            />
        </>
    );
}
