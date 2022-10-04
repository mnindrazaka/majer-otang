package module

import (
	"context"
	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/repository"
)

type paymentUsecase struct {
	billingMemberRepo repository.BillingMemberRepository
	billingRepo       repository.BillingRepository
	memberRepo        repository.MemberRepository
}

type PaymentUsecase interface {
	UpdatePayment(ctx context.Context, paymentRequest *entity.PaymentRequest) error
	GetPaymentByMemberID(ctx context.Context, memberID string) ([]*entity.Payment, error)
}

func NewPaymentUsecase(billingMemberRepo repository.BillingMemberRepository, billingRepo repository.BillingRepository, memberRepo repository.MemberRepository) PaymentUsecase {
	return &paymentUsecase{billingMemberRepo, billingRepo, memberRepo}
}

func (p *paymentUsecase) UpdatePayment(ctx context.Context, paymentRequest *entity.PaymentRequest) error {
	// update target member id
	err := p.billingMemberRepo.UpdateBillingMemberByBillingID(ctx, paymentRequest.TargetMemberId)
	if err != nil {
		return err
	}

	// update charged member id
	err = p.billingMemberRepo.UpdateBillingMemberByBillingID(ctx, paymentRequest.ChargedMemberId)
	if err != nil {
		return err
	}

	return nil
}

func (p *paymentUsecase) GetPaymentByMemberID(ctx context.Context, memberID string) ([]*entity.Payment, error) {
	billings, err := p.billingMemberRepo.GetBillingMemberByChargedMemberID(ctx, memberID, false)
	if err != nil {
		return nil, err
	}

	var mapBilingMemberID = map[string]int{}
	for _, billing := range billings {
		mapBilingMemberID[billing.MemberId] += int(billing.Amount)
	}

	billingsOthers, err := p.billingMemberRepo.GetBillingMemberByChargedMemberID(ctx, memberID, true)
	if err != nil {
		return nil, err
	}

	var mapBilingMemberID2 = map[string]int{}
	for _, other := range billingsOthers {
		mapBilingMemberID2[other.MemberId] += int(other.Amount)
	}

	var payments []*entity.Payment
	for id, amount := range mapBilingMemberID {
		val, ok := mapBilingMemberID2[id]
		var result int
		if ok {
			result = amount - val
			if result < 0 {
				continue
			}

			mapBilingMemberID[id] = result
		}

		// TODO: it's better to use get member by ids, so we don't need to query 1 by 1
		member, err := p.memberRepo.GetMemberByID(ctx, id)
		if err != nil {
			return nil, err
		}

		payments = append(payments, &entity.Payment{
			Name:     member.Name,
			MemberId: id,
			Amount:   int32(mapBilingMemberID[id]),
		})
	}
	
	if payments == nil {
		return []*entity.Payment{}, nil
	}

	return payments, nil
}

func buildPaymentData(bilings []*entity.BillingDetail) []*entity.Payment {
	var payments []*entity.Payment
	for _, biling := range bilings {
		payments = append(payments, &entity.Payment{
			Name:     biling.Title,
			Amount:   biling.BillAmount,
			MemberId: biling.MemberId,
		})
	}

	return payments
}
