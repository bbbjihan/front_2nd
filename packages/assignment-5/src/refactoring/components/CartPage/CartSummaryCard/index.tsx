import { wonFormatter } from "@/refactoring/utils/currencyFormatter";

interface Props {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

const CartSummaryCard = ({
  totalBeforeDiscount,
  totalAfterDiscount,
  totalDiscount,
}: Props) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
      <div className="space-y-1">
        <p>상품 금액: {wonFormatter(totalBeforeDiscount)}</p>
        <p className="text-green-600">
          할인 금액: {wonFormatter(totalDiscount)}
        </p>
        <p className="text-xl font-bold">
          최종 결제 금액: {wonFormatter(totalAfterDiscount)}
        </p>
      </div>
    </div>
  );
};

export default CartSummaryCard;
