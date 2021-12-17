import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { getMaxPrecision, safeParseUnits } from '@pooltogether/utilities'
import { usePrizePoolTokens, useUsersPrizePoolBalances } from '@pooltogether/hooks'
import { FieldValues, UseFormReturn } from 'react-hook-form'

import { TokenIcon } from '../Icons/TokenIcon'
import { ThemedClipSpinner } from '../Loading/ThemedClipSpinner'

import WalletIcon from 'assets/images/icon-wallet.svg'

interface PrizePool {
  address: string
  chainId: number
}

interface DepositAmountInputProps {
  form: UseFormReturn<FieldValues, object>
  prizePool: PrizePool
  inputKey: string
  usersAddress: string
  className?: string
  widthClassName?: string
}

/**
 * For use in conjunction with react-hook-form
 * @param props
 * @returns
 */
export const DepositAmountInput = (props: DepositAmountInputProps) => {
  const { prizePool, className, widthClassName, form, inputKey, usersAddress } = props

  return (
    <div
      className={classNames(className, widthClassName, 'flex flex-col', 'font-inter', 'text-xl')}
    >
      <DepositInputHeader
        prizePool={prizePool}
        form={form}
        inputKey={inputKey}
        usersAddress={usersAddress}
      />

      <div
        className={classNames(
          'p-0.5 bg-tertiary rounded-lg overflow-hidden',
          'transition-all hover:bg-gradient-cyan focus-within:bg-pt-gradient',
          'cursor-pointer'
        )}
      >
        <div className='bg-tertiary w-full rounded-lg flex'>
          <DepositToken prizePool={prizePool} />
          <Input prizePool={prizePool} form={form} inputKey={inputKey} />
        </div>
      </div>
    </div>
  )
}

DepositAmountInput.defaultProps = {
  widthClassName: 'w-full'
}

interface DepositInputHeaderProps {
  form: UseFormReturn<FieldValues, object>
  prizePool: PrizePool
  inputKey: string
  usersAddress: string
}

const DepositInputHeader = (props: DepositInputHeaderProps) => {
  const { form, prizePool, inputKey, usersAddress } = props

  const { t } = useTranslation()
  const { data: prizePoolTokens } = usePrizePoolTokens(prizePool)
  const { data: usersBalancesData, isFetched: isUsersBalancesFetched } = useUsersPrizePoolBalances(
    usersAddress,
    prizePool
  )

  const { trigger, setValue } = form
  const token = prizePoolTokens?.token
  const usersBalances = usersBalancesData?.balances
  const tokenBalance = usersBalances?.token

  // If the user input a larger amount than their wallet balance before connecting a wallet
  useEffect(() => {
    trigger(inputKey)
  }, [usersAddress, tokenBalance])

  return (
    <div className='flex justify-between font-inter text-xs uppercase font-semibold text-pt-purple-dark text-opacity-60 dark:text-pt-purple-lighter mb-1'>
      <span className={classNames('')}>{t('amount')}</span>
      {usersAddress && (
        <button
          id='_setMaxDepositAmount'
          type='button'
          className='font-bold inline-flex items-center '
          disabled={!tokenBalance}
          onClick={(e) => {
            e.preventDefault()
            setValue(inputKey, tokenBalance.amount, { shouldValidate: true })
          }}
        >
          <img src={WalletIcon} className='mr-2' style={{ maxHeight: 12 }} />
          {!isUsersBalancesFetched ? (
            <ThemedClipSpinner sizeClassName='w-3 h-3' className='mr-2 opacity-50' />
          ) : (
            <span className='mr-1'>{tokenBalance?.amountPretty || 0}</span>
          )}
          <span>{token?.symbol}</span>
        </button>
      )}
    </div>
  )
}

const DepositToken = (props: { prizePool: PrizePool }) => {
  const { prizePool } = props
  const { data: prizePoolTokens } = usePrizePoolTokens(prizePool)
  const token = prizePoolTokens?.token

  if (!token) {
    return null
  }

  return (
    <div
      className={classNames(
        'flex items-center',
        'py-4 pl-8 pr-4',
        'placeholder-white placeholder-opacity-50'
      )}
    >
      <TokenIcon
        sizeClassName='w-6 h-6'
        className='mr-2'
        chainId={prizePool.chainId}
        address={token.address}
      />
      <span className='font-bold'>{token.symbol}</span>
    </div>
  )
}

interface InputProps {
  prizePool: PrizePool
  form: UseFormReturn<FieldValues, object>
  inputKey: string
}

const Input = (props: InputProps) => {
  const { form, inputKey, prizePool } = props
  const { t } = useTranslation()

  const { register } = form

  const validate = useDepositValidationRules(prizePool)

  const pattern = {
    value: /^\d*\.?\d*$/,
    message: t('pleaseEnterAPositiveNumber')
  }

  return (
    <input
      className={classNames(
        'bg-transparent w-full outline-none focus:outline-none active:outline-none text-right py-4 pr-8 pl-4 font-semibold'
        // 'rounded-lg'
      )}
      placeholder='0.0'
      {...register(inputKey, { required: true, pattern, validate })}
    />
  )
}

/**
 * Returns validation rules for the deposit input
 * @param prizePool
 * @returns
 */
const useDepositValidationRules = (prizePool: PrizePool) => {
  const { t } = useTranslation()
  const usersAddress = useUsersAddress()
  const { data: prizePoolTokens } = usePrizePoolTokens(prizePool)
  const { data: usersBalancesData } = useUsersPrizePoolBalances(usersAddress, prizePool)

  const token = prizePoolTokens?.token
  const decimals = token?.decimals
  const usersBalances = usersBalancesData?.balances
  const tokenBalance = usersBalances?.token
  const ticketBalance = usersBalances?.ticket

  return {
    isValid: (v: string) => {
      const isNotANumber = isNaN(Number(v))
      if (isNotANumber) return false

      const quantityUnformatted = safeParseUnits(v, decimals)

      if (!!usersAddress) {
        if (!tokenBalance) return false
        if (!ticketBalance) return false
        if (quantityUnformatted && tokenBalance.amountUnformatted.lt(quantityUnformatted))
          return t(
            'insufficientFundsGetTokensBelow',
            'Insufficient funds. Get or swap tokens below.'
          )
      }

      if (getMaxPrecision(v) > Number(decimals)) return false
      if (quantityUnformatted && quantityUnformatted.isZero()) return false
      return true
    }
  }
}
