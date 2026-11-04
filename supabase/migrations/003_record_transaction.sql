-- Upgrade for databases created before income and expenses were written by a function.
-- Safe to run after 001_schema.sql. Fresh databases already include this function.

create or replace function record_transaction(
  p_type text,
  p_category text,
  p_amount numeric,
  p_transaction_date date,
  p_description text,
  p_payment_method text,
  p_customer uuid,
  p_order uuid,
  p_project uuid,
  p_receipt text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid := gen_random_uuid();
begin
  if not is_admin() then
    raise exception 'Not allowed';
  end if;
  if p_type not in ('income', 'expense') then
    raise exception 'Invalid transaction type';
  end if;
  if p_type = 'income' and p_category not in ('deposit', 'final_payment', 'product_sale', 'other_income') then
    raise exception 'Invalid income category';
  end if;
  if p_type = 'expense' and p_category not in ('material_purchase', 'labour', 'transportation', 'electricity', 'maintenance', 'rent', 'other_expense') then
    raise exception 'Invalid expense category';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'Amount must be greater than zero';
  end if;
  if coalesce(p_payment_method, '') not in ('cash', 'mobile_money', 'bank', 'other') then
    raise exception 'Invalid payment method';
  end if;

  insert into transactions (
    id, type, category, amount, transaction_date, description, payment_method,
    customer_id, order_id, project_id, receipt_path, created_by
  ) values (
    new_id,
    p_type,
    p_category,
    round(p_amount, 2),
    coalesce(p_transaction_date, current_date),
    coalesce(p_description, ''),
    p_payment_method,
    p_customer,
    p_order,
    p_project,
    nullif(p_receipt, ''),
    auth.uid()
  );
  return new_id;
end;
$$;

drop policy if exists transactions_admin on transactions;
drop policy if exists transactions_admin_read on transactions;
create policy transactions_admin_read on transactions for select to authenticated
using (is_admin());

revoke all on function record_transaction(text, text, numeric, date, text, text, uuid, uuid, uuid, text) from public;
grant execute on function record_transaction(text, text, numeric, date, text, text, uuid, uuid, uuid, text) to authenticated;
