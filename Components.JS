COMPONENTS = {
    
    "Core" : [
        "KiokuJS.Reference",
        "KiokuJS.Serializer",
        "KiokuJS.Serializer.JSON",
        
        "KiokuJS.TypeMap",
        "KiokuJS.TypeMap.Role.NoDeps",
        "KiokuJS.TypeMap.Array",
        "KiokuJS.TypeMap.Object",
        "KiokuJS.TypeMap.Joose",
        
        "KiokuJS.Resolver",
        "KiokuJS.Resolver.Standard",
        
        "KiokuJS.Collapser.Inliner",
        
        "KiokuJS.Linker.Gatherer",
        
        "KiokuJS.Node",
        
        "KiokuJS.Backend",
        "KiokuJS.Backend.Hash",
        
        "KiokuJS.Collapser",
        "KiokuJS.Linker",
        
        "KiokuJS.Scope",
        "KiokuJS"
    ],
    
    
    "Bundle" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Attribute.Bootstrap",
        "jsan:JooseX.SimpleRequest",
        "jsan:Task.JooseX.Namespace.Depended.Web",
        "jsan:Task.JooseX.CPS.All",
        "jsan:Data.UUID",
        "jsan:Data.Visitor",
        "+Core"    
    ]
} 

