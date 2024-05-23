import {useEffect} from "react";
import {useLoaderData, useNavigate} from "react-router-dom";
import {App, Button, Col, Form, Input, InputNumber, Row, Select, Space, Tag} from 'antd';
import {useSubmitSequence} from "./hooks.js";
import {SEQUENCE_STATUSES, SEQUENCE_TYPES} from "./constant.js";


const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
};

const tailLayout = {
    wrapperCol: {offset: 3, span: 21},
};

export default function SequenceEdit() {
    const sequenceData = useLoaderData();
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const navigate = useNavigate();
    const isNew = !sequenceData.name;
    const canSubmit = sequenceData.status === 1;
    useEffect(() => {
        form.setFieldsValue(sequenceData);
    }, [form, sequenceData]);
    const {status : submitStatus, execute} = useSubmitSequence({
        onSuccess: name => {
            if (name) {
                navigate("/sequence/"+ name + "/update");
            } else {
                message.success("Saved");
                navigate(null, {replace: true});
            }
        },
        onError: error => {
            message.error(error.message);
        }
    });

    function onFinish(v) {
        console.info("Form Data", v);
        execute({...v, isNew});
    }

    function onSubmit(submitted) {
        form.setFieldValue("submitted", !!submitted);
        form.submit();
    }

    return (
        <>
            <Row style={{margin:20}}>
                <Col span={16}>
                    <Space>
                        <span>{isNew ? "Creating..." : "Editing..."}</span>
                        <Tag color="red">
                            {SEQUENCE_STATUSES.get(sequenceData.status)}
                        </Tag>
                    </Space>
                </Col>
                <Col span={8} style={{textAlign:"right"}}>
                </Col>
            </Row>
            <Form
                {...formItemLayout}
                onFinish={onFinish}
                form={form}
                initialValues={sequenceData}
                style={{
                    minWidth: 1000,
                    margin: 20,
                }}
                labelAlign="left"
            >
                <Form.Item
                    name="submitted"
                    noStyle
                    hidden
                >
                    <Input />
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
                    <Input disabled={!isNew}/>
                </Form.Item>
                <Form.Item
                    name="type"
                    label="Type"
                    rules={[
                        {
                            required: true,
                            message: 'Type must not be empty!',
                        },
                    ]}
                >
                    <Select
                        disabled={!isNew}
                        placeholder="Type"
                        options={Array.from(SEQUENCE_TYPES, ([k, v]) => ({label: v, value: k}))}
                    />
                </Form.Item>
                <Form.Item
                    name="maxId"
                    label="Max Id"
                    rules={[
                        {
                            required: true,
                            message: 'Max Id must not be empty!',
                        },
                    ]}
                >
                    <InputNumber min={1} disabled={!isNew}/>
                </Form.Item>
                <Form.Item
                    name="step"
                    label="Step"
                    rules={[
                        {
                            required: true,
                            message: 'Step must not be empty!',
                        },
                    ]}
                >
                    <InputNumber min={10} disabled={!isNew}/>
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                >
                    <Input />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space size="large">
                        <Button type="default" onClick={()=>navigate(-1)}>Cancel</Button>
                        {isNew &&
                            <Button type="primary" loading={submitStatus === 'loading'} onClick={()=>onSubmit()}>Create</Button>
                        }
                        {isNew && canSubmit &&
                            <Button type="primary" loading={submitStatus === 'loading'} onClick={()=>onSubmit(true)}>Create and Submit</Button>
                        }
                        {!isNew &&
                            <Button type="primary" loading={submitStatus === 'loading'} onClick={()=>onSubmit()}>Update</Button>
                        }
                        {!isNew && canSubmit &&
                            <Button type="primary" loading={submitStatus === 'loading'} onClick={()=>onSubmit(true)}>Update and Submit</Button>
                        }
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
}