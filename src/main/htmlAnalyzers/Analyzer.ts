export abstract class Analyzer {
    protected abstract analyze(sourceText: string, file): string; 
}