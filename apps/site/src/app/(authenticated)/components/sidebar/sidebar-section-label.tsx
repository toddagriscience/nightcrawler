// Copyright © Todd Agriscience, Inc. All rights reserved.

interface SidebarSectionLabelProps {
  children: string;
}

export default function SidebarSectionLabel({
  children,
}: SidebarSectionLabelProps) {
  return (
    <div className="px-3 pt-6 pb-2">
      <span className="text-foreground/50 text-xs font-medium tracking-wide">
        {children}
      </span>
    </div>
  );
}
