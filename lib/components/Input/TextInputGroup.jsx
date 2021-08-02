import React from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'

import { RoundInput } from './TextInputs'
import { DEFAULT_INPUT_GROUP_CLASSES, DEFAULT_INPUT_LABEL_CLASSES } from '../../constants'

export const TextInputGroupType = Object.freeze({
  text: 'text',
  number: 'number'
})

export const TextInputGroup = (props) => {
  const {
    // Input Props
    Input,
    id,
    label,
    rightLabel,
    disabled,
    readOnly,
    // Utilities
    isError,
    isSuccess,
    large,
    unit,
    ...classAndInputProps
  } = props

  let {
    containerTextClasses,
    containerRoundedClasses,
    containerMarginClasses,
    containerBorderClasses,
    containerBgClasses,
    containerClassName,
    labelClassName,
    rightLabelClassName,
    unitsClassName,
    ...inputProps
  } = classAndInputProps

  containerTextClasses = containerTextClasses
    ? containerTextClasses
    : classnames({
        'font-bold text-3xl': large,
        'text-xs': !large,
        'text-red-500': isError,
        'text-whitesmoke': disabled
      })

  containerRoundedClasses = containerRoundedClasses ? containerRoundedClasses : 'rounded-full'

  containerMarginClasses = containerMarginClasses ? containerMarginClasses : 'mb-2 lg:mb-2'

  containerBorderClasses = containerBorderClasses
    ? containerBorderClasses
    : classnames('border', {
        'border-red': isError,
        'border-green-2': isSuccess,
        'border-transparent': !isError && !isSuccess,
        'hover:border-accent-3 focus-within:border-accent-3 focus-within:shadow-green': !disabled
      })

  containerBgClasses = containerBgClasses
    ? containerBgClasses
    : classnames(containerBgClasses, {
        'bg-grey': disabled,
        'bg-card': readOnly
      })

  labelClassName = labelClassName
    ? labelClassName
    : classnames(DEFAULT_INPUT_LABEL_CLASSES, {
        'cursor-not-allowed font-whitesmoke': disabled,
        'text-accent-1': !disabled
      })

  rightLabelClassName = rightLabelClassName
    ? rightLabelClassName
    : classnames(DEFAULT_INPUT_LABEL_CLASSES, 'text-right', {
        'cursor-not-allowed font-whitesmoke': disabled,
        'text-accent-1': !disabled
      })

  unitsClassName = unitsClassName
    ? unitsClassName
    : classnames('font-bold text-xs sm:text-sm whitespace-no-wrap', {
        'cursor-not-allowed font-whitesmoke': disabled,
        'font-white': !disabled
      })

  containerClassName = classnames(
    DEFAULT_INPUT_GROUP_CLASSES,
    containerClassName,
    containerTextClasses,
    containerRoundedClasses,
    containerMarginClasses,
    containerBgClasses
  )

  let icon, iconColor
  if (isSuccess) {
    icon = 'check-circle'
    iconColor = 'stroke-current text-green-2'
  } else if (isError) {
    icon = 'slash'
    iconColor = 'stroke-current text-red'
  }

  return (
    <div className={containerClassName}>
      <div
        className={classnames('flex flex-row', {
          'justify-between': rightLabel && label,
          'justify-end': rightLabel && !label
        })}
      >
        {label && (
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
        )}
        {rightLabel && <span className={rightLabelClassName}>{rightLabel}</span>}
      </div>
      <div className='flex justify-between'>
        <Input {...inputProps} id={id} disabled={disabled} readOnly={readOnly} />
        {(unit || icon) && (
          <div className='pl-1 sm:pl-2'>
            {unit && <span className={unitsClassName}>{unit}</span>}
            {icon && <FeatherIcon icon={icon} className={classnames('w-4 sm:w-8', iconColor)} />}
          </div>
        )}
      </div>
    </div>
  )
}

TextInputGroup.defaultProps = {
  Input: RoundInput,
  type: TextInputGroupType.text
}

export const RightLabelButton = (props) => {
  const { onClick, children } = props
  return (
    <button type='button' onClick={onClick} className='hover:text-accent-3 trans'>
      {children}
    </button>
  )
}
