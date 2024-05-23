import {useEffect, useRef, useState} from "react";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {App, Button, Col, Form, Input, Modal, Row, Select, Space, Tag} from 'antd';
import "./CreativeEdit.css";
import {useBasicData, useSendCreative, useSubmitCreative} from "./hooks.js";
import {CREATIVE_STATUSES} from "./constant.js";
import {ContentEdit} from "./ContentEdit.jsx";


const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
};

const tailLayout = {
    wrapperCol: {offset: 3, span: 21},
};

export default function CreativeEdit() {
    const creativeData = useLoaderData();
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const {basicData, status: basicDataStatus} = useBasicData();
    const navigate = useNavigate();
    const isNew = !creativeData.creativeId;
    const canActivate = creativeData.status === 1 || creativeData.status === 3;
    useEffect(() => {
        console.info(creativeData);
        form.setFieldsValue(creativeData);
    }, [form, creativeData]);
    const {status : submitStatus, execute} = useSubmitCreative({
        onSuccess: id => {
            if (id) {
                navigate("/creative/"+ id + "/update");
            } else {
                message.success("Saved");
                navigate(null, {replace: true});
            }
        },
        onError: error => {
            message.error(error.message);
        }
    });

    const [creativeSendModalOpen, setCreativeSendOpen] = useState(false);
    if (basicDataStatus !== "success") {
        return null;
    }

    function onFinish(v) {
        console.info("Form Data", v);
        execute(v);
    }

    function onSubmit(activated) {
        form.setFieldValue("activated", !!activated);
        form.submit();
    }

    return (
        <>
        <Row style={{margin:20}}>
            <Col span={16}>
                <Space>
                <span>{isNew ? "Creating..." : "Editing..."}</span>
                <Tag color="red">
                    {CREATIVE_STATUSES.get(creativeData.status)}
                </Tag>
                <Tag color="volcano">
                    {creativeData.channel}
                </Tag>
                </Space>
            </Col>
            <Col span={8} style={{textAlign:"right"}}>
            {!isNew &&
            <Space>
                <Link to={"/creative/add?from=" + creativeData.creativeId}>
                    <Button type="default">Copy</Button>
                </Link>
                <Button type="primary" loading={submitStatus === 'loading'} onClick={()=>setCreativeSendOpen(true)}>Send</Button>
                <CreativeSendModal
                    creativeId={creativeData.creativeId}
                    open={creativeSendModalOpen}
                    onCancel={()=>setCreativeSendOpen(false)}
                    paramsMock={"{\n}"}
                    directly={true}
                />
            </Space>
            }
            </Col>
        </Row>
        <Form
            {...formItemLayout}
            name="CreativeDetail"
            onFinish={onFinish}
            form={form}
            initialValues={creativeData}
            style={{
                minWidth: 1000,
                margin: 20,
            }}
            labelAlign="left"
        >
            <Form.Item
                name="creativeId"
                noStyle
                hidden
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="activated"
                noStyle
                hidden
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="channel"
                noStyle
                hidden
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="categoryId"
                label="category"
                rules={[
                    {
                        required: true,
                        message: 'category must not be empty!',
                    },
                ]}
            >
                <Select
                    placeholder="Category"
                    options={basicData.categories.map(e => ({label: e.name, value: e.categoryId}))}
                />
            </Form.Item>

            <Form.Item
                name="name"
                label="Name"
                rules={[
                    {
                        required: true,
                        message: 'Name must not be empty!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="content"
                label="content"
                rules={[
                    {
                        required: true,
                        message: 'Name must not be empty!',
                    },
                ]}
            >
                <ContentEdit definition={basicData.channelMap.get(creativeData.channel).contentDefinition}/>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Space size="large">
                    <Button type="default" onClick={()=>navigate(-1)}>Cancel</Button>
                    {isNew &&
                        <Button type="primary" loading={submitStatus === 'loading'} onClick={()=>onSubmit()}>Create</Button>
                    }
                    {isNew && canActivate &&
                        <Button type="primary" loading={submitStatus === 'loading'} onClick={()=>onSubmit(true)}>Create and Activate</Button>
                    }
                    {!isNew &&
                        <Button type="primary" loading={submitStatus === 'loading'} onClick={()=>onSubmit()}>Update</Button>
                    }
                    {!isNew && canActivate &&
                        <Button type="primary" loading={submitStatus === 'loading'} onClick={()=>onSubmit(true)}>Update and Activate</Button>
                    }
                </Space>
            </Form.Item>
        </Form>
        </>
    );
}



const useResetFormOnCloseModal = ({ form, open }) => {
    const prevOpenRef = useRef();
    useEffect(() => {
        prevOpenRef.current = open;
    }, [open]);
    const prevOpen = prevOpenRef.current;
    useEffect(() => {
        if (!open && prevOpen) {
            form.resetFields();
        }
    }, [form, prevOpen, open]);
};



function CreativeSendModal({creativeId, open, onCancel, paramsMock, directly}) {
    const [form] = Form.useForm();
    const {message} = App.useApp();
    useResetFormOnCloseModal({form, open});
    const {status, execute} = useSendCreative({
        onSuccess: () => {
            message.success("已发送");
        },
        onError: error => {
            message.error(error.message);
        }
    });

    function onOk() {
        form.submit();
    }
    function onFinish(v) {
        execute({
            ...v,
            params: JSON.parse(v.params),
            directly
        });
    }
    return (
        <Modal
            title="测试发送创意"
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            okText="发送"
            cancelText="取消"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="creativeId"
                    initialValue={creativeId}
                    hidden
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="receiver"
                    label="接收者"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="params"
                    label="参数"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    initialValue={paramsMock}
                >
                    <Input.TextArea rows={10}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

