import {Fragment, useState} from "react";
import {isEqual} from "lodash";
import {App, Button, Col, Input, Row, Space, theme} from "antd";
import {CopyOutlined, DeleteOutlined, PlusOutlined, SnippetsOutlined} from "@ant-design/icons";

function toEntries(value) {
    return value ? Object.entries(value).filter(e => e[0]) : []
}
function fromEntries(entries) {
    return Object.fromEntries(entries.filter(e => e[0]));
}
export function KvEdit({value, onChange}) {
    const [prevValue, setPrevValue] = useState(value);
    const [entries, setEntries] = useState(toEntries(value));
    const {message} = App.useApp();
    const {token} = theme.useToken();
    // if (!isEqual(prevValue, value)) {
    if (prevValue !== value) {
        setPrevValue(value);
        setEntries(toEntries(value));
    }

    function change(newEntries) {
        setEntries(newEntries);
        const newValue = fromEntries(newEntries);
        if (!isEqual(newValue, value)) {
            setPrevValue(newValue);
            onChange?.(newValue);
        }
    }
    function onRemove(entry) {
        change(entries.filter(e => e !== entry));
    }
    function onAdd(index) {
        const at = index >= 0 && index < entries.length ? index: entries.length;
        change([
            ...entries.slice(0, at),
            [null, null],
            ...entries.slice(at),
        ]);
    }
    function onKeyChange(key, entry) {
        change(entries.map(e => e === entry ? [key, entry[1]] : e));
    }
    function onValueChange(value, entry) {
        change(entries.map(e => e === entry ? [entry[0], value] : e));
    }
    function onCopy() {
        navigator.clipboard.writeText(JSON.stringify(entries)).then(()=> {
            message.info("复制成功");
        });
    }
    function onPaste() {
        navigator.clipboard.readText().then(text => {
            const entries = JSON.parse(text);
            change(entries);
        });
    }

    return (
        <div
            style={{
                padding: token.padding,
                backgroundColor: token.colorBgLayout,
                borderRadius: token.borderRadius,
            }}
        >
            <Row
                gutter={[12, 12]}
                align="middle"
            >
                <Col span={6}>名称</Col>
                <Col span={12}>值</Col>
                <Col span={6}>操作</Col>
                {entries.map((entry, index) => (
                    <Fragment
                        key={index}
                    >
                        <Col span={6}>
                            <Input
                                value={entry[0]}
                                onChange={(e) => onKeyChange(e.target.value, entry)}
                            />
                        </Col>
                        <Col span={12}>
                            <Input
                                value={entry[1]}
                                onChange={(e) => onValueChange(e.target.value, entry)}
                            />
                        </Col>
                        <Col span={6}>
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => onAdd(index)}
                                    size="small"
                                    icon={<PlusOutlined />}
                                />
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => onRemove(entry)}
                                    size="small"
                                    icon={<DeleteOutlined />}
                                />
                            </Space>
                        </Col>
                    </Fragment>
                ))}
                <Col span={24}>
                    <Space>
                        <Button
                            type="primary"
                            onClick={onAdd}
                            size="small"
                            icon={<PlusOutlined />}
                        />
                        <Button
                            type="primary"
                            onClick={onCopy}
                            size="small"
                            icon={<CopyOutlined />}
                        />
                        <Button
                            type="primary"
                            onClick={onPaste}
                            size="small"
                            icon={<SnippetsOutlined />}
                        />
                    </Space>
                </Col>
            </Row>
        </div>
    );
}