import React, {Fragment, useState} from "react";
import {isEqual} from "lodash";
import {App, Select, Button, Col, Input, Row, Space, theme} from "antd";
import {CopyOutlined, DeleteOutlined, PlusOutlined, SnippetsOutlined} from "@ant-design/icons";
import {CONTENT_MODES} from "./constant.js";

function toEntries(definition, value) {
    let entries = [];
    Object.entries(definition.items).forEach(([name, def]) => {
        let v = value && value[name] || null;
        entries.push({
            name,
            ...def,
            mode: def.modes[0],
            customized: false,
            ...v
        })
    });
    value && Object.entries(value)
        .filter(([name]) => !definition.items[name])
        .forEach(([name, v]) => {
            entries.push({
                name,
                required: false,
                customized: true,
                ...v
            })
        });
    return entries;
}

function fromEntries(entries) {
    return Object.fromEntries(entries.map(e => [e.name, {
        mode: e.mode,
        value: e.value
    }]));
}


export function ContentEdit({definition, value, onChange}) {
    const [prevValue, setPrevValue] = useState(value);
    const [entries, setEntries] = useState(toEntries(definition, value));
    const {message} = App.useApp();
    const {token} = theme.useToken();
    if (prevValue !== value) {
        setPrevValue(value);
        setEntries(toEntries(definition, value));
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
            {
                name: "newProp",
                mode: 1,
                customized: true,
                required: false
            },
            ...entries.slice(at),
        ]);
    }

    function onItemChange(value, entry) {
        change(entries.map(e => e === entry ? value : e));
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
                <Col span={5}>name</Col>
                <Col span={16}>value</Col>
                <Col span={3}>action</Col>
                {entries.map((entry, index) => (
                    <Fragment
                        key={index}
                    >
                        <ContentItemEdit
                            value={entry}
                            onChange={v => onItemChange(v, entry)}
                        />
                        <Col span={3}>
                            {entry.customized &&
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
                            }
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

function ContentItemEdit({value, onChange}) {
    const [item, setItem] = useState(value);
    if (item !== value) {
        setItem(value);
    }

    function change(newItem) {
        setItem(newItem);
        onChange?.(newItem);
    }

    function onNameChange(name) {
        change({
            ...item,
            name
        });
    }

    function onModeChange(mode) {
        change({
            ...item,
            mode
        });
    }

    function onValueChange(value) {
        change({
            ...item,
            value
        });
    }
    let options = null;
    if (item.modes) {
        options = item.modes.map(m => ({
            label: CONTENT_MODES.get(m),
            value: m
        }));
    } else {
        options = Array.from(CONTENT_MODES, ([k, v]) => ({label: v, value: k}))
    }
    return (<>
        <Col span={5}>
            <Input
                disabled={!item.customized}
                value={item.name}
                onChange={e => onNameChange(e.target.value)}
            />
        </Col>
        <Col span={16}>
        <Row>
            <Col span={6}>
            <Select
                style={{ width: '100%' }}
                placeholder="Mode"
                value={item.mode}
                onChange={onModeChange}
                options={options}
            />
            </Col>
            {
                item.mode === 1 &&
                <Col span={18}>
                <Input
                    style={{ width: '100%' }}
                    value={item.value}
                    onChange={e => onValueChange(e.target.value)}
                />
                </Col>
            }
            {
                item.mode === 2 &&
                <Col span={24}>
                <Input.TextArea
                    style={{ width: '100%' }}
                    value={item.value}
                    rows={4}
                    onChange={e => onValueChange(e.target.value)}
                />
                </Col>
            }
            {
                item.mode === 3 &&
                <Col span={24}>
                    <Input.TextArea
                        style={{ width: '100%' }}
                        value={item.value}
                        rows={4}
                        onChange={e => onValueChange(e.target.value)}
                    />
                </Col>
            }
        </Row>
        </Col>
        </>
    );
}