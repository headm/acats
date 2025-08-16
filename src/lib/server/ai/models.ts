import { createOpenAI } from '@ai-sdk/openai';
import { customProvider } from 'ai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = createOpenAI({ apiKey: OPENAI_API_KEY });

export const myProvider = customProvider({
	languageModels: {
		'chat-model': openai('gpt-4'),
		'chat-model-reasoning': openai('gpt-4'),
		'title-model': openai('gpt-4'),
		'artifact-model': openai('gpt-4')
	}
});
