// Copyright © Todd Agriscience, Inc. All rights reserved.

interface SidebarSectionLabelProps {
  children: string;
}

export default function SidebarSectionLabel({
  children,
}: SidebarSectionLabelProps) {
  return (
    <div className="px-3 pt-6 pb-1">
      <span className="text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        {children}
      </span>
    </div>
  );
}