import React from 'react'
import classnames from 'classnames'
import { getChain } from '@pooltogether/evm-chains-extended'
import { shorten as shortenHash } from '@pooltogether/utilities'

import { CopyIcon } from '../Icons/CopyIcon'
import { LinkIcon } from '../Icons/LinkIcon'

export const BlockExplorerLink = (props) => {
  const {
    address,
    txHash,
    children,
    className,
    shorten,
    noIcon,
    iconClassName,
    copyable,
    chainId
  } = props

  let url
  if (txHash) {
    url = formatBlockExplorerTxUrl(txHash, chainId)
  } else if (address) {
    url = formatBlockExplorerAddressUrl(address, chainId)
  }

  const display = txHash || address

  return (
    <>
      <a
        href={url}
        className={`trans hover:text-highlight-1 ${className} inline-flex`}
        target='_blank'
        rel='noopener noreferrer'
        title='View on Block Explorer'
      >
        {children || (
          <div className='flex'>
            <span
              className={classnames('inline-block', {
                'sm:hidden': !shorten
              })}
            >
              {shortenHash(display)}
            </span>
            <span
              className={classnames('hidden', {
                'sm:inline-block': !shorten
              })}
            >
              {display}
            </span>
            {!noIcon && <LinkIcon className={iconClassName} />}
          </div>
        )}
      </a>
      {copyable && <CopyIcon className='ml-2 my-auto' text={display} />}
    </>
  )
}

BlockExplorerLink.defaultProps = {
  noIcon: false,
  iconClassName: 'h-4 w-4'
}

const formatBlockExplorerTxUrl = (tx, networkId) => {
  try {
    const blockExplorerUrl = getChain(networkId).blockExplorerUrls[0]
    return `${blockExplorerUrl}/tx/${tx}`
  } catch (e) {
    throw new Error('Chain ID not supported')
  }
}

const formatBlockExplorerAddressUrl = (address, networkId) => {
  try {
    const blockExplorerUrl = getChain(networkId).blockExplorerUrls[0]
    return `${blockExplorerUrl}/address/${address}`
  } catch (e) {
    throw new Error('Chain ID not supported')
  }
}
