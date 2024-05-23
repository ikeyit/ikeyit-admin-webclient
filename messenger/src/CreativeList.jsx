import {Link} from "react-router-dom";
import {Alert, Button, Col, Form, Row, Select, Space, Table} from 'antd';
import dayjs from 'dayjs';
import Input from "antd/es/input/Input";
import {useBasicData, useCreativeSearcher} from "./hooks.js";
import {CREATIVE_STATUSES} from "./constant.js";
import {ClearOutlined, SearchOutlined} from "@ant-design/icons";
import {activateCreative, deactivateCreative} from "./loader.js";

export default function CreativeList() {
    const {data, status, error, search, params, setData} = useCreativeSearcher();
    const [form] = Form.useForm();
    const {basicData, status: basicDataStatus} = useBasicData();
    if (basicDataStatus !== "success") {
        return null;
    }

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

    function onActivateClick(creative) {
        activateCreative(creative.creativeId).then(() => {
            const content = data.content.map(c => c === creative ? ({
                ...creative,
                status: 2,
            }) : c);
            setData({
                ...data,
                content
            });
        }, e => {
            alert(e.message);
        });
    }

    function onDeactivateClick(creative) {
        deactivateCreative(creative.creativeId).then(() => {
            const content = data.content.map(c => c === creative ? ({
                ...creative,
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
            title: 'ID',
            dataIndex: 'creativeId',
            key: 'creativeId',
            width: 100,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text, record) => <Link to={"/creative/" + record.creativeId + "/update"}>{text}</Link>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: status => CREATIVE_STATUSES.get(status),
        },
        {
            title: 'Channel',
            dataIndex: 'channel',
            key: 'channel',
            width: 100,
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: 80,
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
            dataIndex: 'creativeId',
            key: 'op',
            width: 240,
            fixed: 'right',
            render: (creativeId, record) => (
                <Space>
                    {(record.status == 1 || record.status == 3) &&
                        <a onClick={() => onActivateClick(record)}>Activate</a>
                    }
                    {(record.status == 2) &&
                        <a onClick={() => onDeactivateClick(record)}>Deactivate</a>
                    }
                    <Link to={"/creative/" + creativeId + "/update"}>Edit</Link>
                    <Link to={"/creative/add?from=" + creativeId}>Copy</Link>
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
                            label="Category"
                            name="categoryId"
                        >
                            <Select
                                allowClear
                                placeholder="Select one category"
                                options={basicData.categories.map(c => ({
                                    label: c.name,
                                    value: c.categoryId
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Channel"
                            name="channelId"
                        >
                            <Select
                                allowClear
                                placeholder="Select one channel"
                                options={basicData.channels.map(c => ({label: c.name, value: c.name}))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="ID"
                            name="creativeId"
                        >
                            <Select
                                mode="tags"
                                placeholder="Creative ID"
                            />
                        </Form.Item>
                    </Col>
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
                                options={Array.from(CREATIVE_STATUSES, ([k, v]) => ({label: v, value: k}))}
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
                rowKey="creativeId"
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
