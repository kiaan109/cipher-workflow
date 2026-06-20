import { NodeType } from "@/generated/prisma";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { openAiExecutor } from "../components/openai/executor";
import { anthropicExecutor } from "../components/anthropic/executor";
import { discordExecutor } from "../components/discord/executor";
import { slackExecutor } from "../components/slack/executor";
import { twitterExecutor } from "../components/twitter/executor";
import { telegramExecutor } from "../components/telegram/executor";
import { linkedinExecutor } from "../components/linkedin/executor";
import { instagramExecutor } from "../components/instagram/executor";
import { whatsappExecutor } from "../components/whatsapp/executor";
import { mistralExecutor } from "../components/mistral/executor";
import { qwenExecutor } from "../components/qwen/executor";
import { emailExecutor } from "../components/email/executor";
import { notionExecutor } from "../components/notion/executor";
import { googleSheetsExecutor } from "../components/google-sheets/executor";
import { githubExecutor } from "../components/github/executor";
import { rssFeedExecutor } from "../components/rss-feed/executor";
import { smsExecutor } from "../components/sms/executor";
import { universalExecutor } from "../components/universal/executor";
import { aiAgentExecutor } from "../components/ai-agent/executor";
import { aiChainExecutor } from "../components/ai-chain/executor";
import { summarizerExecutor } from "../components/summarizer/executor";
import { textClassifierExecutor } from "../components/text-classifier/executor";
import { infoExtractorExecutor } from "../components/info-extractor/executor";
import { outputParserExecutor } from "../components/output-parser/executor";
import { docLoaderExecutor } from "../components/doc-loader/executor";
import { textSplitterExecutor } from "../components/text-splitter/executor";
import { aiMemoryExecutor } from "../components/ai-memory/executor";
import { embeddingsExecutor } from "../components/embeddings/executor";
import { vectorStoreExecutor } from "../components/vector-store/executor";
import { webhookTriggerExecutor } from "@/features/triggers/components/webhook-trigger/executor";
import { scheduleTriggerExecutor } from "@/features/triggers/components/schedule-trigger/executor";
import { autonomousSearchAgentExecutor } from "../components/autonomous-search-agent/executor";
import { gmailSearchExecutor } from "../components/gmail-search/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor,
  [NodeType.OPENAI]: openAiExecutor,
  [NodeType.DISCORD]: discordExecutor,
  [NodeType.SLACK]: slackExecutor,
  [NodeType.TWITTER]: twitterExecutor,
  [NodeType.TELEGRAM]: telegramExecutor,
  [NodeType.LINKEDIN]: linkedinExecutor,
  [NodeType.INSTAGRAM]: instagramExecutor,
  [NodeType.WHATSAPP]: whatsappExecutor,
  [NodeType.MISTRAL]: mistralExecutor,
  [NodeType.QWEN]: qwenExecutor,
  [NodeType.EMAIL]: emailExecutor,
  [NodeType.NOTION]: notionExecutor,
  [NodeType.GOOGLE_SHEETS]: googleSheetsExecutor,
  [NodeType.GITHUB]: githubExecutor,
  [NodeType.RSS_FEED]: rssFeedExecutor,
  [NodeType.SMS]: smsExecutor,
  [NodeType.UNIVERSAL]: universalExecutor,
  [NodeType.AI_AGENT]: aiAgentExecutor,
  [NodeType.AI_CHAIN]: aiChainExecutor,
  [NodeType.SUMMARIZER]: summarizerExecutor,
  [NodeType.TEXT_CLASSIFIER]: textClassifierExecutor,
  [NodeType.INFO_EXTRACTOR]: infoExtractorExecutor,
  [NodeType.OUTPUT_PARSER]: outputParserExecutor,
  [NodeType.DOC_LOADER]: docLoaderExecutor,
  [NodeType.TEXT_SPLITTER]: textSplitterExecutor,
  [NodeType.AI_MEMORY]: aiMemoryExecutor,
  [NodeType.EMBEDDINGS]: embeddingsExecutor,
  [NodeType.VECTOR_STORE]: vectorStoreExecutor,
  [NodeType.WEBHOOK_TRIGGER]: webhookTriggerExecutor,
  [NodeType.SCHEDULE_TRIGGER]: scheduleTriggerExecutor,
  [NodeType.AUTONOMOUS_SEARCH_AGENT]: autonomousSearchAgentExecutor,
  [NodeType.GMAIL_SEARCH]: gmailSearchExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) throw new Error(`No executor found for node type: ${type}`);
  return executor;
};
