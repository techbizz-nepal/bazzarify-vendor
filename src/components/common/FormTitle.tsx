interface IFormTitle {
    label: string
    className?: string
    helpText?: string
}

export default function FormTitle({label, className, helpText}: IFormTitle) {
    return (
        <div className={className}>
            <div className="flex flex-col">
                <p className="text-3xl font-bold">{label}</p>
                {helpText && <small className="text-muted-foreground">{helpText}</small>}
            </div>
        </div>
    )
}
