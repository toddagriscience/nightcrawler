// Copyright © Todd Agriscience, Inc. All rights reserved.

interface SidebarSectionLabelProps {
  children: string;
}

export default function SidebarSectionLabel({
  children,
}: SidebarSectionLabelProps) {
  return (
    <div className="px-3 pt-6 pb-2">
      <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">
        {children}
      </span>
    </div>
  );
}
