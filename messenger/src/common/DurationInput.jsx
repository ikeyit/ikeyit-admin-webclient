import React from "react";
import {InputNumber, Select, Space} from "antd";

export default function DurationInput({value= 0, onChange, disableMultiplier = false}) {
    let remainder = Math.abs(value);
    const days = Math.floor(remainder / 86400000);
    remainder %= 86400000;
    const hours = Math.floor(remainder / 3600000);
    remainder %= 3600000;
    const minutes = Math.floor(remainder / 60000);
    const multiplier = value >= 0 ? 1 : -1;

    function change({multiplier, days, hours, minutes}) {
        onChange?.(multiplier * (days * 86400000 + hours * 3600000 + minutes * 60000));
    }
    function onMultiplierChange(multiplier) {
        change({
            days,
            hours,
            minutes,
            multiplier
        });
    }
    function onDaysChange(days) {
        change({
            days,
            hours,
            minutes,
            multiplier
        });
    }
    function onHoursChange(hours) {
        change({
            days,
            hours,
            minutes,
            multiplier
        });
    }
    function onMinutesChange(minutes) {
        change({
            days,
            hours,
            minutes,
            multiplier
        });
    }

    return (
        <Space>
            {!disableMultiplier &&
            <Select
                value={multiplier}
                onChange={onMultiplierChange}
                style={{
                    width: 70,
                }}
            >
                <Select.Option value={1}>延后</Select.Option>
                <Select.Option value={-1}>提前</Select.Option>
            </Select>
            }
            <InputNumber
                addonAfter="天"
                min={0}
                value={days}
                onChange={onDaysChange}
                style={{
                    width: 110,
                }}
            />
            <InputNumber
                addonAfter="小时"
                min={0}
                max={23}
                value={hours}
                onChange={onHoursChange}
                style={{
                    width: 110,
                }}
            />
            <InputNumber
                addonAfter="分钟"
                min={0}
                max={59}
                value={minutes}
                onChange={onMinutesChange}
                style={{
                    width: 110,
                }}
            />
        </Space>
    );
}