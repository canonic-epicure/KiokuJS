COMPONENTS = {
    
    "Core" : [
        "KiokuJS.Reference",
        "KiokuJS.Serializer",
        "KiokuJS.Serializer.JSON",
        
        "KiokuJS.TypeMap",
        "KiokuJS.TypeMap.Feature.NoDeps",
        "KiokuJS.TypeMap.Array",
        "KiokuJS.TypeMap.Object",
        "KiokuJS.TypeMap.Joose",
        
        "KiokuJS.Resolver",
        "KiokuJS.Resolver.Standard",
        
        "KiokuJS.Collapser.Inliner",
        "KiokuJS.Collapser.Inliner.JSPON",
        
        "KiokuJS.Backend",
        "KiokuJS.Backend.Hash",
        
        "KiokuJS.Node",
        "KiokuJS.Collapser",
        
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

