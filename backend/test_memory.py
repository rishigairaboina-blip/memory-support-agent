
import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

client = Hindsight(
    base_url="https://api.hindsight.vectorize.io",
    api_key="hsk_62934c381cb81709dd94ca281427678a_f5735afefbf32cc0"

)

BANK_ID = "customer-support-demo"

try:
    # Create a memory bank
    bank = client.create_bank(
        bank_id=BANK_ID,
        name="Customer Support Demo"
    )
    print("Bank ready:", bank.bank_id)

    # Store a sample customer interaction
    client.retain(
        bank_id=BANK_ID,
        content=(
            "Customer Alex owns a Dell Inspiron 15. "
            "Alex reported that the laptop overheats. "
            "The agent suggested checking ventilation "
            "and background processes."
        )
    )
    print("Customer memory stored!")

    # Retrieve the memory
    result = client.recall(
        bank_id=BANK_ID,
        query="What laptop does Alex own, and what was the issue?"
    )

    print("\nRecalled memories:")
    for memory in result.results:
        print("-", memory.text)

except Exception as e:
    print("Error:", e)

finally:
    client.close()