package com.sboot.moabayo.aspect;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.sboot.moabayo.dao.BankMapper;
import com.sboot.moabayo.vo.AccountTxMeta;
import com.sboot.moabayo.vo.AccountTxMetaHolder;

import lombok.RequiredArgsConstructor;

@Aspect
@Component
@RequiredArgsConstructor
public class AccountTxLogAspect {

    private final BankMapper bankMapper;

    // 시그니처: (Long userId, Long accountId, Integer amount, ..) 형태를 타겟
    @AfterReturning(
        value = "@annotation(mark) && args(userId, accountId, amount, ..)",
        argNames = "mark,userId,accountId,amount"
    )
    public void writeTxLog(AccountTxLogged mark,
                           Long userId,
                           Long accountId,
                           Integer amount) throws IllegalStateException {

        // 1) user_account_id 확보
        Long userAccountId = bankMapper.findUserAccountId(userId, accountId);
        if (userAccountId == null) {
            // 계좌가 없으면 로그도 남기지 않음
            return;
        }

        // 2) 호출부에서 세팅해둔 거래 메타데이터 읽기(읽고 바로 비움)
        AccountTxMeta meta = AccountTxMetaHolder.getAndClear();

        Integer approvedAmount = meta != null && meta.getApprovedAmount() != null
                ? meta.getApprovedAmount() : amount; // 기본은 메서드의 amount
        String approvedNum   = meta != null ? meta.getApprovedNum()   : null;
        String accountType   = meta != null && meta.getAccountType() != null
                ? meta.getAccountType() : mark.type(); // 기본은 애노테이션 type
        String category      = meta != null ? meta.getCategory()      : null;
        String shopName      = meta != null ? meta.getShopName()      : null;
        String shopNumber    = meta != null ? meta.getShopNumber()    : null;
        String memo          = meta != null ? meta.getMemo()          : null;

        // 3) 트랜잭션 커밋 후에 기록(롤백 시 기록 안 남도록)
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override public void afterCommit() {
                        bankMapper.insertTransaction(
                            userAccountId,
                            approvedAmount,
                            approvedNum,
                            accountType,
                            category,
                            shopName,
                            shopNumber,
                            memo
                        );
                    }
                }
            );
        } else {
            // 혹시 트랜잭션 경계 밖에서 호출된 경우 즉시 기록(드물게)
            bankMapper.insertTransaction(
                userAccountId, approvedAmount, approvedNum,
                accountType, category, shopName, shopNumber, memo
            );
        }
    }
}
