export interface RepositorySnapshot {
    projectRoot: string;
    entries: Array<{
        name: string;
        type: 'dir' | 'file';
    }>;
    readme: string | null;
    packageJson: Record<string, unknown> | null;
}
export declare const readRepositorySnapshot: (projectRoot: string) => RepositorySnapshot;
