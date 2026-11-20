import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentVariables } from 'src/shared/infrastructure/config/env.validation';
import { EvaluateTextUseCase } from '../../application/use-case/evaluate-text.use-case';
import { LocalRules } from '../../domain/port/local-rules.port';
import { ModerationLog } from '../../domain/port/moderation-log.port';
import { ModerationPort } from '../../domain/port/moderation.port';
import { TextClassifier } from '../../domain/port/text-classifier.port';
import { ModerationController } from '../../presentation/moderation.controller';
import { AnthropicClassifier } from '../anthropic/anthropic-classifier';
import { KeywordLocalRules } from '../rules/keyword-local-rules';
import { ModerationDecisionEntity } from '../typeorm/moderation-decision.entity';
import { TypeOrmModerationLog } from '../typeorm/typeorm-moderation-log';
import { MODERATION_SETTINGS, ModerationSettings } from './moderation-settings';

type Config = ConfigService<EnvironmentVariables, true>;

// Módulo completo (docs/arquitectura.md): los puertos se enlazan acá con sus adaptadores. Cambiar de proveedor de
// PLN es cambiar el adaptador de TextClassifier, sin tocar la política ni el caso de uso.
@Module({
    imports: [TypeOrmModule.forFeature([ModerationDecisionEntity])],
    controllers: [ModerationController],
    providers: [
        {
            provide: MODERATION_SETTINGS,
            inject: [ConfigService],
            useFactory: (config: Config): ModerationSettings => ({
                model: config.get('MODERATION_MODEL', { infer: true }),
                monthlyBudgetUsd: config.get('MODERATION_MONTHLY_BUDGET_USD', { infer: true }),
                hasApiKey: !!config.get('ANTHROPIC_API_KEY', { infer: true }),
            }),
        },
        { provide: LocalRules, useClass: KeywordLocalRules },
        { provide: ModerationLog, useClass: TypeOrmModerationLog },
        {
            provide: TextClassifier,
            inject: [ConfigService],
            useFactory: (config: Config) => new AnthropicClassifier({
                apiKey: config.get('ANTHROPIC_API_KEY', { infer: true }) || undefined,
                model: config.get('MODERATION_MODEL', { infer: true }),
                timeoutMs: config.get('MODERATION_TIMEOUT_MS', { infer: true }),
            }),
        },
        {
            provide: ModerationPort,
            inject: [LocalRules, TextClassifier, ModerationLog, MODERATION_SETTINGS],
            useFactory: (rules: LocalRules, classifier: TextClassifier, log: ModerationLog, settings: ModerationSettings) =>
                new EvaluateTextUseCase(rules, classifier, log, settings.monthlyBudgetUsd),
        },
    ],
    exports: [ModerationPort],
})
export class ModerationModule { }
