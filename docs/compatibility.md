# Model Compatibility

| Model Name | Quantization | Status | Sanity QA (gravity, capital of France) |
| :--- | :--- | :--- | :--- |
| [HuggingFaceTB/SmolLM2-135M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct) | FP32,BNB4,Q4 | Verified | Pass |
| [vicgalle/gpt2-alpaca-gpt4](https://huggingface.co/vicgalle/gpt2-alpaca-gpt4) | Unknown | Verified | Pass |
| [willopcbeta/GPT-5-Distill-Qwen3-4B-Instruct-Heretic-ONNX/Q4](https://huggingface.co/willopcbeta/GPT-5-Distill-Qwen3-4B-Instruct-Heretic-ONNX) | Q4 | Verified | Pass |
| [onnx-community/Qwen2.5-0.5B-Instruct](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct) | Q4,INT8,UINT8,BNB4,Q4F16 | Verified | Pass |
| [onnx-community/Phi-4-mini-instruct-ONNX](https://huggingface.co/onnx-community/Phi-4-mini-instruct-ONNX) | Q4 | Verified | Pass |
| [onnx-community/Apertus-8B-Instruct-2509-ONNX](https://huggingface.co/onnx-community/Apertus-8B-Instruct-2509-ONNX) | Q4 | Verified | Pass |
| [onnx-community/Qwen3-4B-Thinking-2507-ONNX](https://huggingface.co/onnx-community/Qwen3-4B-Thinking-2507-ONNX) | Q4 | Verified | Pass |

## Sanity QA checks

This repository uses a short "Sanity QA" to ensure models answer basic factual questions correctly. The check consists of two prompts; a model passes only if it returns correct, concise answers for both.

- Question A — "What is gravity?"
  - Expected: A brief correct definition, e.g. "Gravity is the natural force of attraction between masses; on Earth it causes objects to fall toward the ground and gives objects weight." 
- Question B — "What is the capital of France?"
  - Expected: "Paris."

Pass criteria
- The model must provide correct answers for both Question A and Question B.
- Mark the `Sanity QA` column with `Pass` or `Fail` after manual or automated verification.

Notes
- Keep answers concise and factually correct; overly vague or incorrect answers should be marked as `Fail`.
- If you want, I can run these checks against the models listed and update the table with `Pass/Fail` results — tell me which models to test.
 
## Generation Config Bootstrap
 
LucidLLM automatically reads `generation_config.json` (if available in OPFS) when a model is loaded for the first time.
 
- **Trigger**: First-time load of a unique `modelId @ revision` combination.
- **Priority**: Values in `generation_config.json` overwrite current local app settings once.
- **Fields Mapped**:
  - `temperature` -> `temperature`
  - `top_p` -> `top_p`
  - `repetition_penalty` -> `presence_penalty` (converted via `val - 1.0`)
  - `max_length` / `max_new_tokens` -> `max_length`
- **Persistence**: Subsequent loads of the same model will maintain the user's current settings instead of re-applying defaults.
- **Safety**: If the file is missing or corrupt, existing settings are preserved.
